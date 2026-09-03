// Partner profile — read own profile; update safe fields only.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requirePartner } from "@/lib/partner-session";
import { getPartnerById, logPartnerAudit } from "@/lib/partner-data";
import { cleanText, isSafeHttpUrl, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

function publicProfile(partner: NonNullable<Awaited<ReturnType<typeof getPartnerById>>>) {
  return {
    partnerId: partner.partnerId,
    name: partner.name,
    email: partner.email,
    phone: partner.phone,
    country: partner.country,
    company: partner.company,
    website: partner.website,
    linkedin: partner.linkedin,
    role: partner.role,
    rank: partner.rank,
    commissionRate: partner.commissionRate,
    joinDate: partner.joinDate,
    status: partner.status,
  };
}

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;
  const partner = await getPartnerById(auth.partnerId);
  if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  return NextResponse.json(publicProfile(partner));
}

export async function PATCH(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 8_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const name = cleanText(body.name, 120);
    const company = cleanText(body.company, 160);
    const country = cleanText(body.country, 80);
    const phone = cleanText(body.phone, 40);
    const websiteRaw = cleanText(body.website, 2048);
    const linkedinRaw = cleanText(body.linkedin, 2048);
    const website = isSafeHttpUrl(websiteRaw) ? websiteRaw : "";
    const linkedin = isSafeHttpUrl(linkedinRaw) ? linkedinRaw : "";
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

    await db
      .update(partners)
      .set({
        name,
        company: company || null,
        country: country || null,
        phone: phone || null,
        website: website || null,
        linkedin: linkedin || null,
        updatedAt: new Date(),
      })
      .where(eq(partners.id, auth.partnerId));

    await logPartnerAudit({ actorType: "partner", actorId: String(auth.partnerId), action: "profile_updated", entityType: "partner", entityId: String(auth.partnerId) });
    const updated = await getPartnerById(auth.partnerId);
    return NextResponse.json(updated ? publicProfile(updated) : { success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
