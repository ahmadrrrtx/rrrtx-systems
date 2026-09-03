// Partner document PDF — renders the uploaded official template with the
// partner's dynamic fields overlaid, as a high-resolution PDF.

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { partnerDocuments, partners } from "@/lib/schema";
import { requirePartner } from "@/lib/partner-session";
import { buildTemplatePdf, formatIssueDate, type TemplateFields, type TemplateType } from "@/lib/partner-template-doc";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const { documentId } = await params;
    const rows = await db.select().from(partnerDocuments).where(eq(partnerDocuments.documentId, documentId)).limit(1);
    const doc = rows[0];
    if (!doc || doc.partnerId !== auth.partnerId) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    const partner = await db.select().from(partners).where(eq(partners.id, auth.partnerId)).limit(1);
    const snapshot = (() => {
      try {
        return doc.snapshot ? (JSON.parse(doc.snapshot) as Record<string, unknown>) : null;
      } catch {
        return null;
      }
    })();

    const templateType: TemplateType = doc.type === "joining_letter" ? "joining_letter" : "certificate";
    const fields: TemplateFields = {
      name: (snapshot?.partnerName as string) || partner[0]?.name || "",
      firstName: (partner[0]?.name || "").trim().split(/\s+/)[0],
      country: partner[0]?.country || "",
      rankLabel: (snapshot?.rankLabel as string) || doc.rank || undefined,
      partnerId: (snapshot?.partnerId as string) || partner[0]?.partnerId || "",
      issueDate: formatIssueDate(doc.issueDate),
      documentId: doc.documentId,
      verificationUrl: (snapshot?.verificationUrl as string) || undefined,
    };

    const pdf = await buildTemplatePdf(templateType, fields);
    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${doc.documentId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Document PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
