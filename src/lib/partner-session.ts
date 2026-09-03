// RRRTX Partner Network — session + authorization helpers.
// Reuses the existing HMAC session mechanism with a dedicated cookie so an
// admin session and a partner session can coexist in the same browser.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, verifySessionToken } from "./session";
import { validateRequestOrigin } from "./request-security";

export const PARTNER_SESSION_COOKIE = "rrrtx_partner_session";

export async function createPartnerSessionToken(input: { email: string; partnerId: number }) {
  return createSessionToken({ email: input.email, role: "partner", partnerId: input.partnerId });
}

/** Returns the verified partner session, or null. Never trusts client input. */
export async function getPartnerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(PARTNER_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session || session.role !== "partner" || typeof session.partnerId !== "number") return null;
  return { partnerId: session.partnerId, email: session.email };
}

/**
 * Guards a partner API route. On success returns the authenticated identity;
 * on failure returns a 401 (or 403 origin) response the caller should return.
 */
export async function requirePartner(request?: Request): Promise<
  | NextResponse
  | { partnerId: number; email: string }
> {
  const session = await getPartnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  if (request && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const originError = validateRequestOrigin(request);
    if (originError) return originError;
  }
  return session;
}
