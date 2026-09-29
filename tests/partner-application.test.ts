import { describe, expect, it } from "vitest";
import { enforceRateLimit, clientAddress } from "../src/lib/request-security";
import { isUniqueConstraintError } from "../src/lib/partner-data";
import { CONSENT_VERSION, parseConsent, serializeConsent } from "../src/lib/consent";

function jsonRequest(headers: Record<string, string> = {}) {
  return new Request("https://rrrtx-systems.com/api/partner/apply", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: "{}",
  });
}

describe("partner application identifier collisions", () => {
  it("recognises the unique-constraint errors libSQL raises", () => {
    expect(isUniqueConstraintError(new Error("UNIQUE constraint failed: partner_applications.application_id"))).toBe(true);
    expect(isUniqueConstraintError(new Error("SQLITE_CONSTRAINT: constraint failed"))).toBe(true);
    const libsqlError = Object.assign(new Error("SQLITE_CONSTRAINT_UNIQUE"), {
      name: "LibsqlError",
      code: "SQLITE_CONSTRAINT",
    });
    expect(isUniqueConstraintError(libsqlError)).toBe(true);
  });

  it("does not mistake unrelated failures for a collision", () => {
    expect(isUniqueConstraintError(new Error("no such table: partner_applications"))).toBe(false);
    expect(isUniqueConstraintError(new Error("network unreachable"))).toBe(false);
    expect(isUniqueConstraintError(undefined)).toBe(false);
  });
});

describe("rate limiting tiers", () => {
  it("tracks each scope independently so one cannot exhaust another", () => {
    const headers = { "cf-connecting-ip": "203.0.113.55" };
    const opts = { limit: 2, windowMs: 60_000 };

    // Exhaust the "validation" scope.
    expect(enforceRateLimit(jsonRequest(headers), "test-validation", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest(headers), "test-validation", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest(headers), "test-validation", opts)).not.toBeNull();

    // The "store" scope for the same client must be unaffected.
    expect(enforceRateLimit(jsonRequest(headers), "test-store", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest(headers), "test-store", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest(headers), "test-store", opts)).not.toBeNull();
  });

  it("isolates clients from one another", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(enforceRateLimit(jsonRequest({ "cf-connecting-ip": "203.0.113.1" }), "test-isolation", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest({ "cf-connecting-ip": "203.0.113.2" }), "test-isolation", opts)).toBeNull();
    expect(enforceRateLimit(jsonRequest({ "cf-connecting-ip": "203.0.113.1" }), "test-isolation", opts)).not.toBeNull();
  });

  it("returns Retry-After on the response it blocks with", async () => {
    const headers = { "cf-connecting-ip": "203.0.113.9" };
    const opts = { limit: 1, windowMs: 60_000 };
    enforceRateLimit(jsonRequest(headers), "test-retry-after", opts);
    const blocked = enforceRateLimit(jsonRequest(headers), "test-retry-after", opts);
    expect(blocked?.status).toBe(429);
    expect(Number(blocked?.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("prefers the Cloudflare client address when present", () => {
    const request = jsonRequest({
      "cf-connecting-ip": "203.0.113.77",
      "x-forwarded-for": "10.0.0.1, 10.0.0.2",
    });
    expect(clientAddress(request)).toBe("203.0.113.77");
  });
});

describe("cookie consent state", () => {
  it("round-trips an accepted choice", () => {
    const stored = serializeConsent({ analytics: true, decidedAt: 1_700_000_000_000 });
    const parsed = parseConsent(stored);
    expect(parsed?.analytics).toBe(true);
    expect(parsed?.version).toBe(CONSENT_VERSION);
    expect(parsed?.decidedAt).toBe(1_700_000_000_000);
  });

  it("round-trips a rejected choice", () => {
    expect(parseConsent(serializeConsent({ analytics: false, decidedAt: 1 }))?.analytics).toBe(false);
  });

  it("treats missing, malformed, or outdated values as no decision", () => {
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent("")).toBeNull();
    expect(parseConsent("not-json")).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ version: CONSENT_VERSION })))).toBeNull();
    // A choice recorded against an older category set must be asked again.
    expect(
      parseConsent(encodeURIComponent(JSON.stringify({ version: 0, analytics: true, decidedAt: 1 })))
    ).toBeNull();
  });
});
