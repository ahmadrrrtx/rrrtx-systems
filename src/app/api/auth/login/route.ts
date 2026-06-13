import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = rows[0];
    let authenticated = false;

    if (user) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (valid) authenticated = true;
    }

    if (!authenticated) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@rrrtx.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "rrrtx2024";
      if (email === adminEmail && password === adminPassword) {
        authenticated = true;
        const hash = await bcrypt.hash(password, 10);
        await db.insert(users).values({ email: adminEmail, passwordHash: hash, role: "admin" }).onConflictDoUpdate({
          target: users.email,
          set: { passwordHash: hash },
        });
      }
    }

    if (!authenticated) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("rrrtx_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
