import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("rrrtx_session");
    if (!session || session.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Invalid input. Password must be at least 6 characters." }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@rrrtx.com";
    const rows = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
    const user = rows[0];

    if (user) {
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
    } else {
      const envPassword = process.env.ADMIN_PASSWORD || "rrrtx2024";
      if (currentPassword !== envPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await db.insert(users).values({ email: adminEmail, passwordHash: newHash, role: "admin" }).onConflictDoUpdate({
        target: users.email,
        set: { passwordHash: newHash },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
