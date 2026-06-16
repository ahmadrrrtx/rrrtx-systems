import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  try {
    const rows = await db.select().from(siteSettings);
    // Convert array of {key, value} to an object
    const settingsObj: Record<string, string | null> = {};
    rows.forEach((row) => {
      settingsObj[row.key] = row.value;
    });
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const body = await request.json();
    // body can be an object of key-values, e.g. { hero_title: "...", ... }
    for (const [key, val] of Object.entries(body)) {
      const valueStr = typeof val === "string" ? val : JSON.stringify(val);
      await db
        .insert(siteSettings)
        .values({
          key,
          value: valueStr,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: {
            value: valueStr,
            updatedAt: new Date(),
          },
        });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
