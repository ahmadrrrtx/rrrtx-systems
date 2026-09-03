// Partner commissions — read-only for partners; values are computed server-side by admins.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerCommissions, partnerReferrals } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { requirePartner } from "@/lib/partner-session";

export async function GET() {
  const auth = await requirePartner();
  if (auth instanceof NextResponse) return auth;
  try {
    const rows = await db
      .select()
      .from(partnerCommissions)
      .where(eq(partnerCommissions.partnerId, auth.partnerId))
      .orderBy(desc(partnerCommissions.createdAt));

    // Join referral IDs for display (referral_id → referral_id string).
    const referrals = await db.select().from(partnerReferrals).where(eq(partnerReferrals.partnerId, auth.partnerId));
    const refIdById = new Map(referrals.map((r) => [r.id, r.referralId]));
    return NextResponse.json(
      rows.map((c) => ({ ...c, referralRef: c.referralId ? refIdById.get(c.referralId) || null : null }))
    );
  } catch (error) {
    console.error("Commission fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}
