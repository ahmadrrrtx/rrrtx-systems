// Public partner application. Honeypot + rate limit + server-side sanitization.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerApplications } from "@/lib/schema";
import { formatSequenceId } from "@/lib/partner-logic";
import { nextApplicationSeq } from "@/lib/partner-data";
import { sendLeadNotification } from "@/lib/notifications";
import {
  cleanText,
  enforceRateLimit,
  isSafeHttpUrl,
  isValidEmail,
  readJsonBody,
  validateRequestOrigin,
} from "@/lib/request-security";

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "partner-apply", { limit: 5, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 24_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // Honeypot: bots fill hidden fields.
    if (cleanText(body.hpot, 200)) {
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
      return NextResponse.json({ error: "Please complete all required fields with a valid email." }, { status: 400 });
    }
    if (whyPartner.trim().length < 20 || howRefer.trim().length < 20) {
      return NextResponse.json({ error: "Please tell us a little more about why you want to partner and how you would refer opportunities." }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const seq = await nextApplicationSeq(year);
    const applicationId = formatSequenceId("RRRTX-APP", year, seq);

    await db.insert(partnerApplications).values({
      applicationId,
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
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
