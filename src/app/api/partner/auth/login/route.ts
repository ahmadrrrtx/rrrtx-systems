// Partner login — mirrors the admin login flow with the partner cookie.

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sessionCookieOptions } from "@/lib/session";
import { createPartnerSessionToken, PARTNER_SESSION_COOKIE } from "@/lib/partner-session";
import { logPartnerAudit } from "@/lib/partner-data";
import { clientAddress, cleanText, enforceRateLimit, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "partner-login", { limit: 8, windowMs: 15 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<{ email?: unknown; password?: unknown }>(request, 8_000);
    const email = cleanText(body?.email, 254).toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";
    if (!isValidEmail(email) || !password || password.length > 256) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const rows = await db.select().from(partners).where(eq(partners.email, email)).limit(1);
    const partner = rows[0];
    if (!partner || !partner.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (partner.status !== "active") {
      return NextResponse.json({ error: "Account is not active. Contact RRRTX for support." }, { status: 403 });
    }
    const valid = await bcrypt.compare(password, partner.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createPartnerSessionToken({ email: partner.email, partnerId: partner.id });
    if (!token) {
      console.error("Partner session secret is missing or too short");
      return NextResponse.json({ error: "Login is not configured" }, { status: 503 });
    }

    const cookieStore = await cookies();
    cookieStore.set(PARTNER_SESSION_COOKIE, token, sessionCookieOptions());
    await logPartnerAudit({ actorType: "partner", actorId: partner.partnerId, action: "login", entityType: "partner", entityId: partner.partnerId, ipAddress: clientAddress(request) });
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Partner login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
