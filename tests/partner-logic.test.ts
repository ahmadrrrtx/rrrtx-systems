import { describe, expect, it } from "vitest";
import {
  computeCommission,
  evaluateRank,
  formatAcceptanceId,
  formatReferralId,
  formatSequenceId,
  newPartnerId,
  newSetupCode,
  rankProgress,
  round2,
  sha256Hex,
} from "../src/lib/partner-logic";
import { DEFAULT_RANK_TIERS } from "../src/lib/partner-constants";

describe("commission math", () => {
  it("computes 10% of received payments with 2-decimal rounding", () => {
    expect(computeCommission(5000, 0.1)).toBe(500);
    expect(computeCommission(3333.33, 0.1)).toBe(333.33);
    expect(computeCommission(19.999, 0.1)).toBe(2);
  });

  it("clamps negative and non-finite inputs", () => {
    expect(computeCommission(-100, 0.1)).toBe(0);
    expect(computeCommission(NaN, 0.1)).toBe(0);
    expect(computeCommission(100, Infinity)).toBe(0);
  });

  it("rounds to 2 decimals", () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(0)).toBe(0);
    expect(round2(NaN)).toBe(0);
  });
});

describe("rank evaluation", () => {
  it("starts at starter and advances on OR-qualified thresholds", () => {
    expect(evaluateRank(0, 0).key).toBe("starter");
    expect(evaluateRank(2, 0).key).toBe("bronze");
    expect(evaluateRank(1, 5000).key).toBe("bronze"); // revenue alone
    expect(evaluateRank(10, 0).key).toBe("gold");
    expect(evaluateRank(3, 35000).key).toBe("gold");
    expect(evaluateRank(20, 0).key).toBe("platinum");
  });

  it("never auto-grants elite", () => {
    expect(evaluateRank(999, 999999).key).toBe("platinum");
  });

  it("reports next-tier progress", () => {
    const progress = rankProgress(8, 28400, "silver");
    expect(progress.next?.key).toBe("gold");
    expect(progress.projectsTarget).toBe(10);
    expect(progress.revenueTarget).toBe(35000);
  });

  it("returns null next when at top automatic tier", () => {
    const progress = rankProgress(25, 100000, "platinum");
    expect(progress.next).toBeNull();
  });
});

describe("IDs", () => {
  it("formats sequence IDs deterministically", () => {
    expect(formatSequenceId("RRRTX-APP", 2026, 1)).toBe("RRRTX-APP-2026-0001");
    expect(formatSequenceId("RRRTX-PL", 2026, 42)).toBe("RRRTX-PL-2026-0042");
    expect(formatReferralId(184)).toBe("RRRTX-REF-000184");
    expect(formatAcceptanceId(2026, 7)).toBe("RRRTX-ACC-2026-0007");
  });

  it("generates partner IDs and setup codes in the expected shape", () => {
    const id = newPartnerId();
    expect(id).toMatch(/^RRRTX-[A-HJ-NP-Z2-9]{5}$/);
    const code = newSetupCode();
    expect(code).toMatch(/^RRRTX-[A-HJ-NP-Z2-9]{4}$/);
  });

  it("produces distinct random IDs", () => {
    const set = new Set(Array.from({ length: 100 }, () => newPartnerId()));
    expect(set.size).toBeGreaterThan(95);
  });
});

describe("hashing", () => {
  it("produces a stable 64-char SHA-256 hex digest", async () => {
    const hash = await sha256Hex("hello");
    expect(hash).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
    expect((await sha256Hex("a")).length).toBe(64);
  });
});

describe("default tier seed", () => {
  it("contains six ordered tiers with elite non-automatic", () => {
    expect(DEFAULT_RANK_TIERS.map((t) => t.key)).toEqual(["starter", "bronze", "silver", "gold", "platinum", "elite"]);
    expect(DEFAULT_RANK_TIERS.find((t) => t.key === "elite")?.isAutomatic).toBe(false);
  });
});
