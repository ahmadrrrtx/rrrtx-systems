// Admin — commissions: list; create (server-side math); transition states.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerCommissions, partnerReferrals, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { computeCommission, logPartnerAudit, recomputePartnerRank } from "@/lib/partner-data";
import { round2 } from "@/lib/partner-logic";
import { cleanText, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const [rows, partnerRows, refRows] = await Promise.all([
      db.select().from(partnerCommissions).orderBy(desc(partnerCommissions.createdAt)),
      db.select().from(partners),
      db.select().from(partnerReferrals),
    ]);
    const partnerById = new Map(partnerRows.map((p) => [p.id, { partnerId: p.partnerId, name: p.name }]));
    const refById = new Map(refRows.map((r) => [r.id, r.referralId]));
    return NextResponse.json(
      rows.map((c) => ({
        ...c,
        partner: partnerById.get(c.partnerId) || null,
        referralRef: c.referralId ? refById.get(c.referralId) || null : null,
      }))
    );
  } catch (error) {
    console.error("Commissions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 16_000);
    const partnerId = typeof body?.partnerId === "number" ? body.partnerId : Number(body?.partnerId);
    const referralId = body?.referralId ? Number(body?.referralId) : null;
    const projectName = cleanText(body?.projectName, 160);
    const projectValue = typeof body?.projectValue === "number" ? body.projectValue : Number(body?.projectValue || 0);
    const amountReceived = typeof body?.amountReceived === "number" ? body.amountReceived : Number(body?.amountReceived || 0);
    const rate = typeof body?.commissionRate === "number" ? body.commissionRate : Number(body?.commissionRate || 0);

    if (!Number.isInteger(partnerId) || partnerId <= 0 || !projectName) {
      return NextResponse.json({ error: "Partner and project name are required." }, { status: 400 });
    }
    const partner = (await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1))[0];
    if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });

    const effectiveRate = rate > 0 && rate <= 0.5 ? rate : partner.commissionRate;
    const commissionAmount = computeCommission(amountReceived, effectiveRate);
    const status = amountReceived > 0 ? "payable" : "pending";
    const now = new Date();

    await db.insert(partnerCommissions).values({
      partnerId,
      referralId: referralId && Number.isInteger(referralId) && referralId > 0 ? referralId : null,
      projectName,
      projectValue: round2(projectValue),
      amountReceived: round2(amountReceived),
      commissionRate: round2(effectiveRate),
      commissionAmount,
      status,
      payableDate: status === "payable" ? now : null,
    });

    await logPartnerAudit({
      actorType: "admin",
      actorId: (await getAuthenticatedSession())?.email || "admin",
      action: "commission_created",
      entityType: "commission",
      entityId: String(partner.partnerId),
      meta: { projectName, amountReceived, commissionAmount, status },
    });
    await recomputePartnerRank(partnerId, "admin");
    return NextResponse.json({ success: true, commissionAmount }, { status: 201 });
  } catch (error) {
    console.error("Commission create error:", error);
    return NextResponse.json({ error: "Failed to create commission" }, { status: 500 });
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
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid commission" }, { status: 400 });

    const rows = await db.select().from(partnerCommissions).where(eq(partnerCommissions.id, id)).limit(1);
    const commission = rows[0];
    if (!commission) return NextResponse.json({ error: "Commission not found" }, { status: 404 });

    const actor = (await getAuthenticatedSession())?.email || "admin";
    const action = body?.action;
    const now = new Date();

    if (action === "mark_payable") {
      await db.update(partnerCommissions).set({ status: "payable", payableDate: now, updatedAt: now }).where(eq(partnerCommissions.id, id));
    } else if (action === "mark_paid") {
      const reference = cleanText(body?.paymentReference, 120);
      await db.update(partnerCommissions).set({ status: "paid", paidDate: now, paymentReference: reference || null, updatedAt: now }).where(eq(partnerCommissions.id, id));
    } else if (action === "reversed") {
      await db.update(partnerCommissions).set({ status: "reversed", updatedAt: now }).where(eq(partnerCommissions.id, id));
    } else if (action === "cancelled") {
      await db.update(partnerCommissions).set({ status: "cancelled", updatedAt: now }).where(eq(partnerCommissions.id, id));
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await logPartnerAudit({
      actorType: "admin",
      actorId: actor,
      action: `commission_${String(action)}`,
      entityType: "commission",
      entityId: String(commission.id),
      meta: { previous: commission.status, next: String(action) },
    });
    await recomputePartnerRank(commission.partnerId, actor);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Commission update error:", error);
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}
