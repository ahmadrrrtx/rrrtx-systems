import { describe, expect, it } from "vitest";
import { safeNextPath } from "../src/lib/safe-next";

describe("safeNextPath (login return-path guard)", () => {
  const FALLBACK = "/partner/dashboard";
  const go = (value: string | null) => safeNextPath(value, FALLBACK, ["/partner"]);

  it("keeps a legitimate in-app return path", () => {
    expect(go("/partner/documents")).toBe("/partner/documents");
    expect(go("/partner/referrals?tab=won")).toBe("/partner/referrals?tab=won");
    expect(go("/partner/dashboard")).toBe("/partner/dashboard");
  });

  it("rejects absolute and protocol-relative URLs", () => {
    for (const bad of [
      "https://evil.example/phish",
      "http://evil.example",
      "//evil.example",
      "///evil.example",
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
    ]) {
      expect(go(bad)).toBe(FALLBACK);
    }
  });

  it("rejects backslash and control-character variants used to smuggle a host", () => {
    for (const bad of ["/\\evil.example", "/partner\\@evil.example", "/partner\nhttps://evil.example", "/\tevil.example", "/partner\u0000"]) {
      expect(go(bad)).toBe(FALLBACK);
    }
  });

  it("rejects paths outside the allowed prefix, including the public /partners page", () => {
    expect(go("/dashboard")).toBe(FALLBACK);
    expect(go("/partners")).toBe(FALLBACK);
    expect(go("/partners/apply")).toBe(FALLBACK);
    expect(go("/partnerish")).toBe(FALLBACK);
    expect(go("/")).toBe(FALLBACK);
  });

  it("falls back when the parameter is absent or empty", () => {
    expect(go(null)).toBe(FALLBACK);
    expect(go("")).toBe(FALLBACK);
    expect(go("   ")).toBe(FALLBACK);
  });

  it("supports a different prefix for other surfaces", () => {
    expect(safeNextPath("/dashboard/leads", "/dashboard", ["/dashboard"])).toBe("/dashboard/leads");
    expect(safeNextPath("/partner/documents", "/dashboard", ["/dashboard"])).toBe("/dashboard");
  });
});
