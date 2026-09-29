// Public partner application. Honeypot + tiered rate limit + server-side sanitization.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerApplications } from "@/lib/schema";
import { formatSequenceId } from "@/lib/partner-logic";
import {
  findRecentDuplicateApplication,
  isUniqueConstraintError,
  nextApplicationSeq,
} from "@/lib/partner-data";
import { sendLeadNotification } from "@/lib/notifications";
import {
  cleanText,
  clientAddress,
  enforceRateLimit,
  isSafeHttpUrl,
  isValidEmail,
  readJsonBody,
  validateRequestOrigin,
} from "@/lib/request-security";

/** Minimum length for the two free-text questions, mirrored in the client form. */
const MIN_NARRATIVE_LENGTH = 20;

/** Attempts that never reach the database. Generous: typos must not lock anyone out. */
const FLOOD_LIMIT = { limit: 30, windowMs: 60 * 60 * 1000 };
/** Quota consumed only by applications that are actually stored. */
const STORE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };
/** How many times to retry an identifier collision before giving up. */
const ID_RETRY_ATTEMPTS = 5;

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;

  // Tier 1 — protects the parser and database from floods. Deliberately loose so
  // that ordinary validation mistakes never consume the submission allowance.
  const floodError = enforceRateLimit(request, "partner-apply-flood", FLOOD_LIMIT);
  if (floodError) return floodError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 24_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // Honeypot: bots fill hidden fields. Legitimate submissions should never
    // reach this branch, so log it — a sudden spike is the signal that the
    // trap is catching real people and needs revisiting.
    if (cleanText(body.hpot, 200)) {
      console.warn("partner-apply honeypot triggered", { ip: clientAddress(request) || "unknown" });
      return NextResponse.json({ success: true, applicationId: "RRRTX-APP-0000" }, { status: 202 });
    }

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const phone = cleanText(body.phone, 40);
    const country = cleanText(body.country, 80);
    const role = cleanText(body.role, 80);
    const company = cleanText(body.company, 160);
    const websiteRaw = cleanText(body.website, 2048);
    const linkedinRaw = cleanText(body.linkedin, 2048);
    const website = isSafeHttpUrl(websiteRaw) ? websiteRaw : "";
    const linkedin = isSafeHttpUrl(linkedinRaw) ? linkedinRaw : "";
    const experience = cleanText(body.experience, 3000);
    const referralBackground = cleanText(body.referralBackground, 3000);
    const whyPartner = cleanText(body.whyPartner, 3000);
    const howRefer = cleanText(body.howRefer, 3000);

    if (!name || !isValidEmail(email) || !country) {
      return NextResponse.json(
        { error: "Please complete all required fields with a valid email.", field: "name" },
        { status: 400 }
      );
    }
    if (whyPartner.length < MIN_NARRATIVE_LENGTH || howRefer.length < MIN_NARRATIVE_LENGTH) {
      return NextResponse.json(
        {
          error: `Please tell us a little more about why you want to partner and how you would refer opportunities (at least ${MIN_NARRATIVE_LENGTH} characters each).`,
          field: whyPartner.length < MIN_NARRATIVE_LENGTH ? "whyPartner" : "howRefer",
        },
        { status: 400 }
      );
    }

    // Idempotent double-submit handling: return the identifier already issued
    // rather than creating a second row for the same person.
    const duplicateId = await findRecentDuplicateApplication({ email, name, whyPartner });
    if (duplicateId) {
      return NextResponse.json({ success: true, applicationId: duplicateId, duplicate: true }, { status: 200 });
    }

    // Tier 2 — the real quota, consumed only by applications we intend to store.
    const storeError = enforceRateLimit(request, "partner-apply-store", STORE_LIMIT);
    if (storeError) return storeError;

    const year = new Date().getFullYear();
    let applicationId: string | null = null;

    // A count-based sequence can collide when two requests arrive together, so
    // retry on a UNIQUE violation instead of failing the submission outright.
    for (let attempt = 0; attempt < ID_RETRY_ATTEMPTS && !applicationId; attempt += 1) {
      const seq = await nextApplicationSeq(year);
      const candidate = formatSequenceId("RRRTX-APP", year, seq);
      try {
        await db.insert(partnerApplications).values({
          applicationId: candidate,
          name,
          email,
          phone: phone || null,
          country: country || null,
          role: role || null,
          company: company || null,
          website: website || null,
          linkedin: linkedin || null,
          experience: experience || null,
          referralBackground: referralBackground || null,
          whyPartner,
          howRefer,
          status: "pending",
        });
        applicationId = candidate;
      } catch (error) {
        if (isUniqueConstraintError(error) && attempt < ID_RETRY_ATTEMPTS - 1) continue;
        throw error;
      }
    }

    if (!applicationId) {
      console.error("Partner application could not allocate an identifier", { email });
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }

    // Fire-and-forget: notification failure must never fail the submission.
    void sendLeadNotification({
      subject: `New Partner Application from ${name}`,
      lines: [
        ["Application ID", applicationId],
        ["Name", name],
        ["Email", email],
        ["Country", country || "—"],
        ["Company", company || "—"],
        ["Role", role || "—"],
        ["LinkedIn", linkedin || "—"],
        ["Why partner", whyPartner],
        ["How they will refer", howRefer],
      ],
    });

    return NextResponse.json({ success: true, applicationId }, { status: 201 });
  } catch (error) {
    console.error("Partner application error:", error);
    return NextResponse.json(
      { error: "We could not save your application. Please try again in a moment." },
      { status: 500 }
    );
  }
}
