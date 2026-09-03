// Partner documents — list own documents with verification URLs.

import { NextResponse } from "next/server";
import { requirePartner } from "@/lib/partner-session";
import { getPartnerDocuments } from "@/lib/partner-data";
import { SITE_URL } from "@/lib/site-config";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;
  try {
    const docs = await getPartnerDocuments(auth.partnerId);
    return NextResponse.json(
      docs.map((d) => {
        let snapshot: Record<string, unknown> | null = null;
        try {
          snapshot = d.snapshot ? (JSON.parse(d.snapshot) as Record<string, unknown>) : null;
        } catch {
          snapshot = null;
        }
        return {
          id: d.id,
          documentId: d.documentId,
          type: d.type,
          rank: d.rank,
          issueDate: d.issueDate,
          status: d.status,
          verificationUrl: snapshot && typeof snapshot.verificationUrl === "string" ? snapshot.verificationUrl : `${SITE_URL}/verify/${d.documentId}`,
        };
      })
    );
  } catch (error) {
    console.error("Documents fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}
