import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Simple admin credentials - change this in production
const ADMIN_EMAIL = "admin@rrrtx.com";
const ADMIN_HASH = "$2a$10$YourHashedPasswordHere"; // We'll check plaintext for demo then upgrade

// For initial setup, allow a simple password check and set a cookie
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // In production, verify against Turso users table. For now, simple env-based check.
    const adminEmail = process.env.ADMIN_EMAIL || "admin@rrrtx.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "rrrtx2024";

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("rrrtx_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
