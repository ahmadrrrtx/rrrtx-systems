// Admin — partners: list; change status, rank (manual override), commission rate.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerRankHistory, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { issuePartnerDocument, logPartnerAudit } from "@/lib/partner-data";
import { round2 } from "@/lib/partner-logic";
import { DEFAULT_RANK_TIERS, PARTNER_STATUSES } from "@/lib/partner-constants";
import { readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const rows = await db.select().from(partners).orderBy(desc(partners.createdAt));
    return NextResponse.json(rows.map((p) => ({ ...p, passwordHash: undefined, setupTokenHash: undefined })));
  } catch (error) {
    console.error("Partners fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
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
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid partner" }, { status: 400 });

    const rows = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
    const partner = rows[0];
    if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    const session = await getAuthenticatedSession();
    const actor = session?.email || "admin";
    const action = body?.action;

    if (action === "status") {
      const status = body?.status;
      if (typeof status !== "string" || !(PARTNER_STATUSES as readonly string[]).includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      await db.update(partners).set({ status, updatedAt: new Date() }).where(eq(partners.id, id));
      await logPartnerAudit({ actorType: "admin", actorId: actor, action: `partner_${status}`, entityType: "partner", entityId: partner.partnerId, meta: { previous: partner.status } });
      return NextResponse.json({ success: true });
    }

    if (action === "rank") {
      const rank = body?.rank;
      if (typeof rank !== "string" || !DEFAULT_RANK_TIERS.some((t) => t.key === rank)) {
        return NextResponse.json({ error: "Invalid rank" }, { status: 400 });
      }
      if (rank !== partner.rank) {
        await db.update(partners).set({ rank, updatedAt: new Date() }).where(eq(partners.id, id));
        await db.insert(partnerRankHistory).values({
          partnerId: id,
          previousRank: partner.rank,
          newRank: rank,
          reason: "Manual override by administrator",
          actor,
        });
        await logPartnerAudit({ actorType: "admin", actorId: actor, action: "rank_changed", entityType: "partner", entityId: partner.partnerId, meta: { previousRank: partner.rank, newRank: rank, manual: true } });
        if (rank !== "starter") {
          await issuePartnerDocument(id, "achievement_certificate", rank, actor);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (action === "rate") {
      const rate = typeof body?.commissionRate === "number" ? body.commissionRate : Number(body?.commissionRate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 0.5) {
        return NextResponse.json({ error: "Commission rate must be between 0 and 0.50." }, { status: 400 });
      }
      await db.update(partners).set({ commissionRate: round2(rate), updatedAt: new Date() }).where(eq(partners.id, id));
      await logPartnerAudit({ actorType: "admin", actorId: actor, action: "commission_rate_changed", entityType: "partner", entityId: partner.partnerId, meta: { previous: partner.commissionRate, next: round2(rate) } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Partner update error:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}
