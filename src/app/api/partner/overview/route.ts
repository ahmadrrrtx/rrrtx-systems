// Partner dashboard overview — aggregates stats server-side (no client math).

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerCommissions, partnerDocuments, partnerReferrals } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { requirePartner } from "@/lib/partner-session";
import {
  computeRankInputs,
  getPartnerById,
  getPartnerStats,
  getRankTiers,
  hasPartnerSignedVersion,
} from "@/lib/partner-data";
import { AGREEMENT_VERSION } from "@/lib/partner-agreement";
import { rankProgress } from "@/lib/partner-logic";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const partner = await getPartnerById(auth.partnerId);
    if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    const [stats, tiers, signed, referrals, commissions, documents] = await Promise.all([
      getPartnerStats(auth.partnerId),
      getRankTiers(),
      hasPartnerSignedVersion(auth.partnerId, AGREEMENT_VERSION),
      db.select().from(partnerReferrals).where(eq(partnerReferrals.partnerId, auth.partnerId)).orderBy(desc(partnerReferrals.createdAt)).limit(5),
      db.select().from(partnerCommissions).where(eq(partnerCommissions.partnerId, auth.partnerId)).orderBy(desc(partnerCommissions.createdAt)).limit(5),
      db.select().from(partnerDocuments).where(eq(partnerDocuments.partnerId, auth.partnerId)).orderBy(desc(partnerDocuments.createdAt)).limit(10),
    ]);
    const { wonProjects, attributedRevenue } = await computeRankInputs(auth.partnerId);
    const progress = rankProgress(wonProjects, attributedRevenue, partner.rank, tiers);

    return NextResponse.json({
      partner: {
        id: partner.partnerId,
        name: partner.name,
        email: partner.email,
        rank: partner.rank,
        rankLabel: progress.next ? partner.rank : partner.rank,
        commissionRate: partner.commissionRate,
        joinDate: partner.joinDate,
        status: partner.status,
      },
      agreementSigned: signed,
      stats,
      progress: progress.next
        ? {
            nextKey: progress.next.key,
            nextLabel: progress.next.label,
            projects: progress.projects,
            projectsTarget: progress.projectsTarget,
            revenue: progress.revenue,
            revenueTarget: progress.revenueTarget,
          }
        : null,
      recentReferrals: referrals,
      recentCommissions: commissions,
      documents: documents.map((d) => ({ documentId: d.documentId, type: d.type, rank: d.rank, issueDate: d.issueDate, status: d.status })),
    });
  } catch (error) {
    console.error("Partner overview error:", error);
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}
