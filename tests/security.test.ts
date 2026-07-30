import { beforeAll, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "../src/lib/session";
import { isSafeHttpUrl, isSafePublicUrl, isValidEmail, pickAllowedFields } from "../src/lib/request-security";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-session-secret-with-sufficient-length";
});

describe("admin sessions", () => {
  it("accepts a valid signed admin token", async () => {
    const token = await createSessionToken({ email: "admin@example.com", role: "admin" });
    expect(token).toBeTruthy();
    const payload = await verifySessionToken(token);
    expect(payload?.email).toBe("admin@example.com");
    expect(payload?.role).toBe("admin");
  });

  it("rejects legacy, forged, and modified tokens", async () => {
    expect(await verifySessionToken("authenticated")).toBeNull();
    const token = await createSessionToken({ email: "admin@example.com", role: "admin" });
    expect(await verifySessionToken(`${token}modified`)).toBeNull();
  });
});

describe("request validation", () => {
  it("validates email and public HTTP URLs", () => {
    expect(isValidEmail("person@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isSafeHttpUrl("https://example.com/path")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafePublicUrl("/downloads/guide.html")).toBe(true);
    expect(isSafePublicUrl("//malicious.example/path")).toBe(false);
    expect(isSafePublicUrl("javascript:alert(1)")).toBe(false);
  });

  it("removes fields outside an update allowlist", () => {
    expect(pickAllowedFields({ title: "Safe", role: "admin", id: 3 }, ["title"])).toEqual({ title: "Safe" });
  });
});
