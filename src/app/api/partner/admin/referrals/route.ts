// Admin — referrals: list (with partner + client info); update status, link to a lead.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerReferrals, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { logPartnerAudit, recomputePartnerRank } from "@/lib/partner-data";
import { REFERRAL_STATUSES } from "@/lib/partner-constants";
import { readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const [refs, partnerRows] = await Promise.all([
      db.select().from(partnerReferrals).orderBy(desc(partnerReferrals.createdAt)),
      db.select().from(partners),
    ]);
    const byId = new Map(partnerRows.map((p) => [p.id, { partnerId: p.partnerId, name: p.name, email: p.email }]));
    return NextResponse.json(
      refs.map((r) => ({ ...r, partner: byId.get(r.partnerId) || null }))
    );
  } catch (error) {
    console.error("Referrals fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 16_000);
    const id = typeof body?.id === "number" ? body.id : Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid referral" }, { status: 400 });

    const rows = await db.select().from(partnerReferrals).where(eq(partnerReferrals.id, id)).limit(1);
    const referral = rows[0];
    if (!referral) return NextResponse.json({ error: "Referral not found" }, { status: 404 });

    const session = await getAuthenticatedSession();
    const actor = session?.email || "admin";

    const status = body?.status;
    const leadId = body?.leadId;
    const updates: Partial<typeof partnerReferrals.$inferInsert> = { updatedAt: new Date() };

    if (typeof status === "string" && (REFERRAL_STATUSES as readonly string[]).includes(status)) {
      updates.status = status;
    } else if (status !== undefined) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (leadId !== undefined && leadId !== null) {
      const numericLeadId = Number(leadId);
      if (Number.isInteger(numericLeadId) && numericLeadId > 0) updates.leadId = numericLeadId;
    }

    if (status === "won") {
      updates.leadId = updates.leadId ?? referral.leadId ?? null;
    }
    await db.update(partnerReferrals).set(updates).where(eq(partnerReferrals.id, id));

    await logPartnerAudit({
      actorType: "admin",
      actorId: actor,
      action: "referral_status_changed",
      entityType: "referral",
      entityId: referral.referralId,
      meta: { previous: referral.status, next: updates.status ?? referral.status },
    });

    // A won referral feeds the partner's rank progression.
    if (updates.status === "won" || referral.status === "won") {
      await recomputePartnerRank(referral.partnerId, actor);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral update error:", error);
    return NextResponse.json({ error: "Failed to update referral" }, { status: 500 });
  }
}
