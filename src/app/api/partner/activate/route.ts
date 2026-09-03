// Partner account activation — sets a password using the one-time setup code.

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logPartnerAudit } from "@/lib/partner-data";
import { clientAddress, cleanText, enforceRateLimit, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "partner-activate", { limit: 10, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<{ email?: unknown; code?: unknown; password?: unknown }>(request, 8_000);
    const email = cleanText(body?.email, 254).toLowerCase();
    const code = cleanText(body?.code, 40).toUpperCase().replace(/[^A-Z0-9-]/g, "");
    const password = typeof body?.password === "string" ? body.password : "";

    if (!isValidEmail(email) || !code || password.length < 10 || password.length > 256) {
      return NextResponse.json({ error: "Provide a valid email, setup code, and a password of at least 10 characters." }, { status: 400 });
    }

    const rows = await db.select().from(partners).where(eq(partners.email, email)).limit(1);
    const partner = rows[0];
    if (!partner || !partner.setupTokenHash || !partner.setupTokenExpiresAt) {
      return NextResponse.json({ error: "Setup code not found for this account." }, { status: 400 });
    }
    if (partner.status !== "active") {
      return NextResponse.json({ error: "Account is not active." }, { status: 403 });
    }
    if (partner.setupTokenExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Setup code expired. Contact RRRTX to re-issue one." }, { status: 400 });
    }
    const valid = await bcrypt.compare(code, partner.setupTokenHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid setup code." }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    await db
      .update(partners)
      .set({ passwordHash: hash, setupTokenHash: null, setupTokenExpiresAt: null, updatedAt: new Date() })
      .where(eq(partners.id, partner.id));

    await logPartnerAudit({ actorType: "partner", actorId: partner.partnerId, action: "account_activated", entityType: "partner", entityId: partner.partnerId, ipAddress: clientAddress(request) });
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Partner activation error:", error);
    return NextResponse.json({ error: "Activation failed" }, { status: 500 });
  }
}
