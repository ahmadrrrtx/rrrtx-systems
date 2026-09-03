// Partner agreement — read current version; accept + record an immutable signature.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerAgreements } from "@/lib/schema";
import { requirePartner } from "@/lib/partner-session";
import { ensureAgreementVersion, getPartnerDocuments, hasPartnerSignedVersion, issuePartnerDocument, logPartnerAudit, nextAcceptanceSeq } from "@/lib/partner-data";
import { AGREEMENT_SECTIONS, AGREEMENT_TITLE } from "@/lib/partner-agreement";
import { formatAcceptanceId } from "@/lib/partner-logic";
import { clientAddress, cleanText, enforceRateLimit, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  const version = await ensureAgreementVersion();
  if (!version) {
    return NextResponse.json({ error: "Agreement is not available" }, { status: 500 });
  }
  const signed = await hasPartnerSignedVersion(auth.partnerId, version.version);
  return NextResponse.json({
    version: version.version,
    title: AGREEMENT_TITLE,
    sections: AGREEMENT_SECTIONS,
    signed,
  });
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "partner-agreement-sign", { limit: 5, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await readJsonBody<{ signedName?: unknown; acknowledged?: unknown }>(request, 8_000);
    const signedName = cleanText(body?.signedName, 120);
    const acknowledged = body?.acknowledged === true;
    if (!signedName || signedName.length < 2) {
      return NextResponse.json({ error: "Please type your legal name to sign." }, { status: 400 });
    }
    if (!acknowledged) {
      return NextResponse.json({ error: "You must confirm that you have read and agree to the agreement." }, { status: 400 });
    }

    const version = await ensureAgreementVersion();
    if (!version) {
      return NextResponse.json({ error: "Agreement is not available" }, { status: 500 });
    }
    if (await hasPartnerSignedVersion(auth.partnerId, version.version)) {
      return NextResponse.json({ error: "This version has already been signed." }, { status: 409 });
    }

    const year = new Date().getFullYear();
    const seq = await nextAcceptanceSeq(year);
    const acceptanceRecordId = formatAcceptanceId(year, seq);

    await db.insert(partnerAgreements).values({
      partnerId: auth.partnerId,
      version: version.version,
      acceptanceRecordId,
      signedName,
      signatureData: JSON.stringify({ type: "typed_acceptance", acknowledged: true }),
      documentHash: version.contentHash,
      ipAddress: clientAddress(request) || null,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
    });

    await logPartnerAudit({
      actorType: "partner",
      actorId: String(auth.partnerId),
      action: "agreement_signed",
      entityType: "agreement",
      entityId: acceptanceRecordId,
      meta: { version: version.version, documentHash: version.contentHash },
      ipAddress: clientAddress(request),
    });

    // Onboarding completes: issue the Joining Letter and Partnership Certificate once.
    const existingDocs = await getPartnerDocuments(auth.partnerId);
    if (!existingDocs.some((d) => d.type === "joining_letter")) {
      await issuePartnerDocument(auth.partnerId, "joining_letter", null, "system");
      await issuePartnerDocument(auth.partnerId, "partnership_certificate", null, "system");
    }

    return NextResponse.json({ success: true, acceptanceRecordId, version: version.version }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Agreement signing error:", error);
    return NextResponse.json({ error: "Failed to record acceptance" }, { status: 500 });
  }
}
