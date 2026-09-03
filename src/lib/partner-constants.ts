// RRRTX Partner Network — domain constants (statuses, ranks, config).

export const PARTNER_COMMISSION_DEFAULT = 0.1; // 10% — governed by the Partner Agreement

export const APPLICATION_STATUSES = ["pending", "under_review", "approved", "rejected"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const PARTNER_STATUSES = ["active", "suspended", "terminated"] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const REFERRAL_STATUSES = [
  "submitted",
  "under_review",
  "contacted",
  "discovery",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const COMMISSION_STATUSES = ["pending", "payable", "paid", "cancelled", "reversed"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const DOCUMENT_STATUSES = ["valid", "revoked"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export interface RankTier {
  key: string;
  label: string;
  minProjects: number;
  minRevenue: number;
  sortOrder: number;
  isAutomatic: boolean;
}

// Initial rank model. Thresholds are OR-qualified ("X projects OR $Y revenue").
// Elite is a manual, strategic recognition and is never auto-granted.
// These are maintainable in the `partner_rank_tiers` table; this is the seed.
export const DEFAULT_RANK_TIERS: RankTier[] = [
  { key: "starter", label: "Starter", minProjects: 0, minRevenue: 0, sortOrder: 0, isAutomatic: true },
  { key: "bronze", label: "Bronze", minProjects: 2, minRevenue: 5000, sortOrder: 1, isAutomatic: true },
  { key: "silver", label: "Silver", minProjects: 5, minRevenue: 15000, sortOrder: 2, isAutomatic: true },
  { key: "gold", label: "Gold", minProjects: 10, minRevenue: 35000, sortOrder: 3, isAutomatic: true },
  { key: "platinum", label: "Platinum", minProjects: 20, minRevenue: 75000, sortOrder: 4, isAutomatic: true },
  { key: "elite", label: "Elite", minProjects: 0, minRevenue: 0, sortOrder: 5, isAutomatic: false },
];

export function rankLabel(key: string): string {
  return DEFAULT_RANK_TIERS.find((tier) => tier.key === key)?.label || key;
}

export function rankColorClass(key: string): string {
  switch (key) {
    case "elite":
      return "bg-pink-500/10 text-pink-300 border-pink-500/25";
    case "platinum":
      return "bg-cyan-500/10 text-cyan-300 border-cyan-500/25";
    case "gold":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/25";
    case "silver":
      return "bg-slate-400/10 text-slate-300 border-slate-400/25";
    case "bronze":
      return "bg-orange-500/10 text-orange-300 border-orange-500/25";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/25";
  }
}
