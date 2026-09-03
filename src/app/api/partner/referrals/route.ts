// Partner referrals — list own; create new (server-validated, owner-scoped).

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerReferrals, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { requirePartner } from "@/lib/partner-session";
import { hasPartnerSignedVersion, logPartnerAudit, nextReferralSeq } from "@/lib/partner-data";
import { AGREEMENT_VERSION } from "@/lib/partner-agreement";
import { formatReferralId } from "@/lib/partner-logic";
import { cleanText, enforceRateLimit, isSafeHttpUrl, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;
  try {
    const rows = await db.select().from(partnerReferrals).where(eq(partnerReferrals.partnerId, auth.partnerId)).orderBy(desc(partnerReferrals.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Referral fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "partner-referral", { limit: 20, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    // Referrals require a signed agreement (onboarding gate).
    if (!(await hasPartnerSignedVersion(auth.partnerId, AGREEMENT_VERSION))) {
      return NextResponse.json({ error: "You must accept the Partner Agreement before submitting referrals." }, { status: 403 });
    }
    const partnerRows = await db.select().from(partners).where(eq(partners.id, auth.partnerId)).limit(1);
    if (!partnerRows[0] || partnerRows[0].status !== "active") {
      return NextResponse.json({ error: "Account is not active." }, { status: 403 });
    }

    const body = await readJsonBody<Record<string, unknown>>(request, 24_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const businessName = cleanText(body.businessName, 160);
    const contactName = cleanText(body.contactName, 120);
    const contactEmail = cleanText(body.contactEmail, 254).toLowerCase();
    const contactPhone = cleanText(body.contactPhone, 40);
    const websiteRaw = cleanText(body.website, 2048);
    const website = isSafeHttpUrl(websiteRaw) ? websiteRaw : "";
    const industry = cleanText(body.industry, 120);
    const service = cleanText(body.service, 120);
    const budget = cleanText(body.budget, 80);
    const relationship = cleanText(body.relationship, 3000);
    const notes = cleanText(body.notes, 3000);
    const attribution = cleanText(body.attribution, 160);

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }
    if (contactEmail && !isValidEmail(contactEmail)) {
      return NextResponse.json({ error: "Contact email is invalid." }, { status: 400 });
    }

    const seq = await nextReferralSeq();
    const referralId = formatReferralId(seq);

    await db.insert(partnerReferrals).values({
      referralId,
      partnerId: auth.partnerId,
      businessName,
      contactName: contactName || null,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      website: website || null,
      industry: industry || null,
      service: service || null,
      budget: budget || null,
      relationship: relationship || null,
      notes: notes || null,
      attribution: attribution || null,
      status: "submitted",
    });

    await logPartnerAudit({ actorType: "partner", actorId: String(auth.partnerId), action: "referral_submitted", entityType: "referral", entityId: referralId, meta: { businessName } });
    return NextResponse.json({ success: true, referralId }, { status: 201 });
  } catch (error) {
    console.error("Referral submission error:", error);
    return NextResponse.json({ error: "Failed to submit referral" }, { status: 500 });
  }
}
