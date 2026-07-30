import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { readJsonBody } from "@/lib/request-security";

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const session = await getAuthenticatedSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await readJsonBody<{
      currentPassword?: unknown;
      newPassword?: unknown;
    }>(request, 8_000);
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || newPassword.length < 12 || newPassword.length > 256) {
      return NextResponse.json(
        { error: "Password must be between 12 and 256 characters." },
        { status: 400 }
      );
    }

    const rows = await db.select().from(users).where(eq(users.email, session.email)).limit(1);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
