// RRRTX Partner Network — pure, testable business logic (no DB, no requests).

import { DEFAULT_RANK_TIERS, type RankTier } from "./partner-constants";

/** Round monetary values to 2 decimal places (server-side financial math). */
export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Commission = amountReceived × rate, clamped and rounded. */
export function computeCommission(amountReceived: number, rate: number): number {
  if (!Number.isFinite(amountReceived) || !Number.isFinite(rate)) return 0;
  return round2(Math.max(0, amountReceived) * Math.max(0, rate));
}

/** Evaluate the highest auto-qualified rank. Elite is manual-only. */
export function evaluateRank(
  wonProjects: number,
  attributedRevenue: number,
  tiers: RankTier[] = DEFAULT_RANK_TIERS
): RankTier {
  const candidates = tiers.filter((tier) => tier.isAutomatic);
  let best = candidates[0];
  for (const tier of candidates) {
    const qualifies = wonProjects >= tier.minProjects || attributedRevenue >= tier.minRevenue;
    if (qualifies && tier.sortOrder >= best.sortOrder) best = tier;
  }
  return best;
}

/** Compute the progress toward the next automatic tier, for the dashboard. */
export function rankProgress(
  wonProjects: number,
  attributedRevenue: number,
  currentKey: string,
  tiers: RankTier[] = DEFAULT_RANK_TIERS
): { next: RankTier | null; projects: number; revenue: number; projectsTarget: number; revenueTarget: number } {
  const current = tiers.find((tier) => tier.key === currentKey);
  const next = tiers
    .filter((tier) => tier.isAutomatic && tier.sortOrder > (current?.sortOrder ?? 0))
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];
  if (!next) {
    return { next: null, projects: wonProjects, revenue: attributedRevenue, projectsTarget: 0, revenueTarget: 0 };
  }
  return {
    next,
    projects: Math.min(wonProjects, next.minProjects),
    revenue: attributedRevenue,
    projectsTarget: next.minProjects,
    revenueTarget: next.minRevenue,
  };
}

/** Unambiguous alphabet (no I, L, O, 0, 1) for human-readable IDs. */
const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Partner ID, e.g. RRRTX-A7K29. */
export function newPartnerId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  let suffix = "";
  for (let i = 0; i < 5; i += 1) suffix += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return `RRRTX-${suffix}`;
}

/** Sequential document ID, e.g. RRRTX-PL-2026-0001. */
export function formatSequenceId(prefix: string, year: number, seq: number, width = 4): string {
  const safeYear = Math.max(2000, Math.floor(year));
  const safeSeq = Math.max(1, Math.floor(seq));
  return `${prefix}-${safeYear}-${String(safeSeq).padStart(width, "0")}`;
}

/** Referral ID, e.g. RRRTX-REF-000184. */
export function formatReferralId(seq: number): string {
  return `RRRTX-REF-${String(Math.max(1, Math.floor(seq))).padStart(6, "0")}`;
}

/** Acceptance record ID, e.g. RRRTX-ACC-2026-0001. */
export function formatAcceptanceId(year: number, seq: number): string {
  return formatSequenceId("RRRTX-ACC", year, seq);
}

/** One-time account setup code (random, unambiguous). */
export function newSetupCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  let code = "";
  for (let i = 0; i < 4; i += 1) code += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return `RRRTX-${code}`;
}

/** SHA-256 hex digest of a string (Web Crypto; usable in Node and edge runtimes). */
export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
