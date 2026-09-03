import { beforeAll, describe, expect, it } from "vitest";
import { createPartnerSessionToken } from "../src/lib/partner-session";
import { createSessionToken, verifySessionToken } from "../src/lib/session";

beforeAll(() => {
  process.env.ADMIN_SESSION_SECRET = "test-session-secret-with-sufficient-length";
});

describe("partner sessions", () => {
  it("embeds and returns the partnerId for a partner session", async () => {
    const token = await createPartnerSessionToken({ email: "partner@example.com", partnerId: 7 });
    expect(token).toBeTruthy();
    const payload = await verifySessionToken(token);
    expect(payload?.role).toBe("partner");
    expect(payload?.partnerId).toBe(7);
  });

  it("rejects a modified partner token", async () => {
    const token = await createPartnerSessionToken({ email: "partner@example.com", partnerId: 7 });
    expect(await verifySessionToken(`${token}x`)).toBeNull();
  });

  it("keeps admin and partner tokens distinct roles", async () => {
    const admin = await createSessionToken({ email: "admin@example.com", role: "admin" });
    const partner = await createPartnerSessionToken({ email: "p@example.com", partnerId: 3 });
    const adminPayload = await verifySessionToken(admin);
    const partnerPayload = await verifySessionToken(partner);
    expect(adminPayload?.role).toBe("admin");
    expect(adminPayload?.partnerId).toBeUndefined();
    expect(partnerPayload?.role).toBe("partner");
    expect(partnerPayload?.partnerId).toBe(3);
  });

  it("does not carry a partnerId unless explicitly provided", async () => {
    const token = await createSessionToken({ email: "admin@example.com", role: "admin" });
    const payload = await verifySessionToken(token);
    expect(payload?.partnerId).toBeUndefined();
  });
});
