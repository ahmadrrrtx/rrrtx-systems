// RRRTX Partner Network — server-side data access + shared business operations.
// All queries here are owner-scoped by the callers. Never trust client ids.

import { and, asc, desc, eq, like } from "drizzle-orm";
import { db } from "./db";
import {
  partnerAgreements,
  partnerAgreementVersions,
  partnerApplications,
  partnerAuditLogs,
  partnerCommissions,
  partnerDocuments,
  partnerRankHistory,
  partnerRankTiers,
  partnerReferrals,
  partners,
} from "./schema";
import { AGREEMENT_TITLE, AGREEMENT_VERSION, agreementHashSource } from "./partner-agreement";
import { DEFAULT_RANK_TIERS, type RankTier } from "./partner-constants";
import { computeCommission, evaluateRank, formatSequenceId, round2, sha256Hex } from "./partner-logic";
import { buildDocumentSnapshot } from "./partner-documents";

export type PartnerRow = typeof partners.$inferSelect;
export type ApplicationRow = typeof partnerApplications.$inferSelect;
export type ReferralRow = typeof partnerReferrals.$inferSelect;
export type CommissionRow = typeof partnerCommissions.$inferSelect;
export type AgreementRow = typeof partnerAgreements.$inferSelect;
export type DocumentRow = typeof partnerDocuments.$inferSelect;

// ── Rank tiers ────────────────────────────────────────────────

export async function getRankTiers(): Promise<RankTier[]> {
  try {
    const rows = await db.select().from(partnerRankTiers).orderBy(asc(partnerRankTiers.sortOrder));
    if (rows.length) {
      return rows.map((r) => ({
        key: r.key,
        label: r.label,
        minProjects: r.minProjects,
        minRevenue: r.minRevenue,
        sortOrder: r.sortOrder,
        isAutomatic: r.isAutomatic,
      }));
    }
  } catch (error) {
    console.error("getRankTiers error:", error);
  }
  // Seed lazily so the module works before migrations are applied.
  try {
    await seedRankTiers();
  } catch (error) {
    console.error("seedRankTiers error:", error);
  }
  return DEFAULT_RANK_TIERS;
}

export async function seedRankTiers() {
  const existing = await db.select().from(partnerRankTiers);
  if (existing.length) return;
  await db.insert(partnerRankTiers).values(
    DEFAULT_RANK_TIERS.map((t) => ({
      key: t.key,
      label: t.label,
      minProjects: t.minProjects,
      minRevenue: t.minRevenue,
      sortOrder: t.sortOrder,
      isAutomatic: t.isAutomatic,
    }))
  );
}

// ── Partners ──────────────────────────────────────────────────

export async function getPartnerById(id: number): Promise<PartnerRow | null> {
  try {
    const rows = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getPartnerById error:", error);
    return null;
  }
}

export async function getPartnerByEmail(email: string): Promise<PartnerRow | null> {
  try {
    const rows = await db.select().from(partners).where(eq(partners.email, email)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getPartnerByEmail error:", error);
    return null;
  }
}

// ── Agreement versioning ─────────────────────────────────────

export async function getActiveAgreementVersion() {
  try {
    const rows = await db
      .select()
      .from(partnerAgreementVersions)
      .where(eq(partnerAgreementVersions.isActive, true))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getActiveAgreementVersion error:", error);
    return null;
  }
}

export async function ensureAgreementVersion() {
  const existing = await getActiveAgreementVersion();
  if (existing) return existing;
  const content = agreementHashSource();
  const contentHash = await sha256Hex(content);
  await db
    .insert(partnerAgreementVersions)
    .values({ version: AGREEMENT_VERSION, title: AGREEMENT_TITLE, content, contentHash, isActive: true })
    .onConflictDoNothing();
  return getActiveAgreementVersion();
}

export async function hasPartnerSignedVersion(partnerId: number, version: string): Promise<boolean> {
  try {
    const rows = await db
      .select()
      .from(partnerAgreements)
      .where(and(eq(partnerAgreements.partnerId, partnerId), eq(partnerAgreements.version, version)))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error("hasPartnerSignedVersion error:", error);
    return false;
  }
}

// ── Dashboard stats / rank inputs ────────────────────────────

export async function computeRankInputs(partnerId: number) {
  const [referrals, commissions] = await Promise.all([
    db.select().from(partnerReferrals).where(eq(partnerReferrals.partnerId, partnerId)),
    db.select().from(partnerCommissions).where(eq(partnerCommissions.partnerId, partnerId)),
  ]);
  const wonProjects = referrals.filter((r) => r.status === "won").length;
  const attributedRevenue = round2(
    commissions.filter((c) => c.status !== "cancelled" && c.status !== "reversed").reduce((sum, c) => sum + (c.amountReceived || 0), 0)
  );
  return { wonProjects, attributedRevenue };
}

export async function getPartnerStats(partnerId: number) {
  const [referrals, commissions] = await Promise.all([
    db.select().from(partnerReferrals).where(eq(partnerReferrals.partnerId, partnerId)),
    db.select().from(partnerCommissions).where(eq(partnerCommissions.partnerId, partnerId)),
  ]);
  const active = commissions.filter((c) => c.status !== "cancelled" && c.status !== "reversed");
  return {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter((r) => r.status !== "won" && r.status !== "lost").length,
    wonProjects: referrals.filter((r) => r.status === "won").length,
    attributedRevenue: round2(active.reduce((s, c) => s + (c.amountReceived || 0), 0)),
    commissionEarned: round2(active.reduce((s, c) => s + (c.commissionAmount || 0), 0)),
    commissionPaid: round2(commissions.filter((c) => c.status === "paid").reduce((s, c) => s + (c.commissionAmount || 0), 0)),
    commissionPending: round2(commissions.filter((c) => c.status === "pending" || c.status === "payable").reduce((s, c) => s + (c.commissionAmount || 0), 0)),
  };
}

// ── Rank recompute (auto-promote only) ───────────────────────

export async function recomputePartnerRank(partnerId: number, actor: string): Promise<string | null> {
  const partner = await getPartnerById(partnerId);
  if (!partner) return null;
  const tiers = await getRankTiers();
  const { wonProjects, attributedRevenue } = await computeRankInputs(partnerId);
  const evaluated = evaluateRank(wonProjects, attributedRevenue, tiers);
  const currentTier = tiers.find((t) => t.key === partner.rank);
  if (!currentTier || evaluated.sortOrder <= currentTier.sortOrder) return partner.rank;

  await db.update(partners).set({ rank: evaluated.key, updatedAt: new Date() }).where(eq(partners.id, partnerId));
  await db.insert(partnerRankHistory).values({
    partnerId,
    previousRank: partner.rank,
    newRank: evaluated.key,
    reason: `Auto-promoted: met ${evaluated.label} thresholds (${wonProjects} projects / $${round2(attributedRevenue)} revenue)`,
    actor,
  });
  await logPartnerAudit({
    actorType: "system",
    actorId: null,
    action: "rank_changed",
    entityType: "partner",
    entityId: partner.partnerId,
    meta: { previousRank: partner.rank, newRank: evaluated.key, wonProjects, attributedRevenue },
  });
  if (evaluated.key !== "starter") {
    await issuePartnerDocument(partnerId, "achievement_certificate", evaluated.key, actor);
  }
  return evaluated.key;
}

// ── Documents ─────────────────────────────────────────────────

export async function issuePartnerDocument(
  partnerId: number,
  type: "joining_letter" | "partnership_certificate" | "achievement_certificate",
  rank: string | null,
  actor: string
): Promise<string | null> {
  const partner = await getPartnerById(partnerId);
  if (!partner) return null;
  const year = new Date().getFullYear();
  const prefix = type === "joining_letter" ? "RRRTX-PL" : type === "partnership_certificate" ? "RRRTX-CERT" : "RRRTX-ACH";
  const seq = await nextYearSeq(prefix, year);
  const documentId = formatSequenceId(prefix, year, seq);
  const snapshot = buildDocumentSnapshot(partner, type, rank || partner.rank, documentId);
  await db.insert(partnerDocuments).values({
    documentId,
    partnerId,
    type,
    rank: rank || partner.rank,
    snapshot: JSON.stringify(snapshot),
  });
  await logPartnerAudit({
    actorType: actor === "system" ? "system" : "admin",
    actorId: actor === "system" ? null : actor,
    action: "document_issued",
    entityType: "document",
    entityId: documentId,
    meta: { type, rank: rank || partner.rank },
  });
  return documentId;
}

async function nextYearSeq(prefix: string, year: number): Promise<number> {
  try {
    const rows = await db
      .select({ documentId: partnerDocuments.documentId })
      .from(partnerDocuments)
      .where(like(partnerDocuments.documentId, `${prefix}-${year}-%`));
    return rows.length + 1;
  } catch (error) {
    console.error("nextYearSeq error:", error);
    return 1;
  }
}

export async function nextApplicationSeq(year: number): Promise<number> {
  try {
    const rows = await db
      .select({ applicationId: partnerApplications.applicationId })
      .from(partnerApplications)
      .where(like(partnerApplications.applicationId, `RRRTX-APP-${year}-%`));
    return rows.length + 1;
  } catch (error) {
    console.error("nextApplicationSeq error:", error);
    return 1;
  }
}

export async function nextReferralSeq(): Promise<number> {
  try {
    const rows = await db.select({ id: partnerReferrals.id }).from(partnerReferrals);
    return rows.length + 1;
  } catch (error) {
    console.error("nextReferralSeq error:", error);
    return 1;
  }
}

export async function nextAcceptanceSeq(year: number): Promise<number> {
  try {
    const rows = await db
      .select({ acceptanceRecordId: partnerAgreements.acceptanceRecordId })
      .from(partnerAgreements)
      .where(like(partnerAgreements.acceptanceRecordId, `RRRTX-ACC-${year}-%`));
    return rows.length + 1;
  } catch (error) {
    console.error("nextAcceptanceSeq error:", error);
    return 1;
  }
}

export async function getPublicDocument(documentId: string): Promise<DocumentRow | null> {
  try {
    const rows = await db.select().from(partnerDocuments).where(eq(partnerDocuments.documentId, documentId)).limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getPublicDocument error:", error);
    return null;
  }
}

export async function getPartnerDocuments(partnerId: number): Promise<DocumentRow[]> {
  try {
    return await db
      .select()
      .from(partnerDocuments)
      .where(eq(partnerDocuments.partnerId, partnerId))
      .orderBy(desc(partnerDocuments.createdAt));
  } catch (error) {
    console.error("getPartnerDocuments error:", error);
    return [];
  }
}

// ── Audit logging ─────────────────────────────────────────────

export async function logPartnerAudit(input: {
  actorType: "admin" | "partner" | "system";
  actorId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  meta?: Record<string, unknown> | null;
  ipAddress?: string | null;
}) {
  try {
    await db.insert(partnerAuditLogs).values({
      actorType: input.actorType,
      actorId: input.actorId || null,
      action: input.action,
      entityType: input.entityType || null,
      entityId: input.entityId || null,
      meta: input.meta ? JSON.stringify(input.meta) : null,
      ipAddress: input.ipAddress || null,
    });
  } catch (error) {
    console.error("logPartnerAudit error:", error);
  }
}

// Re-export the pure commission helper so routes use one source of truth.
export { computeCommission };
