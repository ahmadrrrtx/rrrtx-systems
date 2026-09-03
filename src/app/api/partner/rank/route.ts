// Partner rank — current rank, all tiers, progression, and change history.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerRankHistory, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { requirePartner } from "@/lib/partner-session";
import { computeRankInputs, getRankTiers } from "@/lib/partner-data";
import { rankProgress } from "@/lib/partner-logic";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;

  try {
    const [partner, tiers, history] = await Promise.all([
      db.select().from(partners).where(eq(partners.id, auth.partnerId)).limit(1),
      getRankTiers(),
      db.select().from(partnerRankHistory).where(eq(partnerRankHistory.partnerId, auth.partnerId)).orderBy(desc(partnerRankHistory.createdAt)),
    ]);
    if (!partner[0]) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    const { wonProjects, attributedRevenue } = await computeRankInputs(auth.partnerId);
    const progress = rankProgress(wonProjects, attributedRevenue, partner[0].rank, tiers);

    return NextResponse.json({
      currentRank: partner[0].rank,
      wonProjects,
      attributedRevenue,
      tiers: tiers.map((t) => ({
        ...t,
        achieved: t.sortOrder <= (tiers.find((x) => x.key === partner[0].rank)?.sortOrder ?? 0),
      })),
      progress: progress.next
        ? { nextKey: progress.next.key, nextLabel: progress.next.label, projects: progress.projects, projectsTarget: progress.projectsTarget, revenue: progress.revenue, revenueTarget: progress.revenueTarget }
        : null,
      history,
    });
  } catch (error) {
    console.error("Rank fetch error:", error);
    return NextResponse.json({ error: "Failed to load rank" }, { status: 500 });
  }
}
