// Admin — Partner Network overview metrics.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerApplications, partnerCommissions, partnerReferrals, partners } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-check";
import { round2 } from "@/lib/partner-logic";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const [applications, partnerRows, referrals, commissions] = await Promise.all([
      db.select().from(partnerApplications).orderBy(desc(partnerApplications.createdAt)),
      db.select().from(partners),
      db.select().from(partnerReferrals),
      db.select().from(partnerCommissions),
    ]);

    const active = commissions.filter((c) => c.status !== "cancelled" && c.status !== "reversed");
    const metrics = {
      totalPartners: partnerRows.length,
      activePartners: partnerRows.filter((p) => p.status === "active").length,
      pendingApplications: applications.filter((a) => a.status === "pending").length,
      activeReferrals: referrals.filter((r) => r.status !== "won" && r.status !== "lost").length,
      wonProjects: referrals.filter((r) => r.status === "won").length,
      attributedRevenue: round2(active.reduce((s, c) => s + (c.amountReceived || 0), 0)),
      commissionsPayable: round2(commissions.filter((c) => c.status === "payable").reduce((s, c) => s + (c.commissionAmount || 0), 0)),
      commissionsPaid: round2(commissions.filter((c) => c.status === "paid").reduce((s, c) => s + (c.commissionAmount || 0), 0)),
    };

    return NextResponse.json({
      metrics,
      recentApplications: applications.slice(0, 6).map((a) => ({
        id: a.id,
        applicationId: a.applicationId,
        name: a.name,
        email: a.email,
        country: a.country,
        status: a.status,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error("Partner overview error:", error);
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}
