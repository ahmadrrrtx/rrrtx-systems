import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import {
  cleanText,
  enforceRateLimit,
  isValidEmail,
  readJsonBody,
  validateRequestOrigin,
} from "@/lib/request-security";

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "admin-login", {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<{ email?: unknown; password?: unknown }>(request, 8_000);
    const email = cleanText(body?.email, 254).toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";
    if (!isValidEmail(email) || !password || password.length > 256) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user = rows[0];

    if (user) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid || user.role !== "admin") {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else {
      // Backwards-compatible one-time bootstrap. There are deliberately no
      // source-code defaults, and this path is unavailable after a DB user exists.
      const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const hash = await bcrypt.hash(password, 12);
      const inserted = await db
        .insert(users)
        .values({ email: adminEmail, passwordHash: hash, role: "admin" })
        .onConflictDoNothing()
        .returning();
      user = inserted[0] || (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
    }

    if (!user) {
      return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }

    const token = await createSessionToken({ email: user.email, role: user.role });
    if (!token) {
      console.error("Admin session secret is missing or too short");
      return NextResponse.json({ error: "Login is not configured" }, { status: 503 });
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions());
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
