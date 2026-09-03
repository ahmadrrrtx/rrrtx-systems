// Signed Partner Agreement PDF — renders the uploaded agreement master template
// with the partner's acceptance details overlaid.

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { partnerAgreements } from "@/lib/schema";
import { requirePartner } from "@/lib/partner-session";
import { buildTemplatePdf, formatIssueDate } from "@/lib/partner-template-doc";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const rows = await db
      .select()
      .from(partnerAgreements)
      .where(eq(partnerAgreements.partnerId, auth.partnerId))
      .orderBy(desc(partnerAgreements.acceptedAt))
      .limit(1);
    const agreement = rows[0];
    if (!agreement) {
      return NextResponse.json({ error: "No signed agreement found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    const pdf = await buildTemplatePdf("agreement", {
      name: agreement.signedName,
      issueDate: formatIssueDate(agreement.acceptedAt),
      acceptanceRecordId: agreement.acceptanceRecordId,
    });

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${agreement.acceptanceRecordId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Agreement PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
