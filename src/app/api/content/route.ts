import { db } from "@/lib/db";
import { contentPages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { cleanText, readJsonBody } from "@/lib/request-security";

const PUBLIC_CONTENT = new Set(["privacy", "terms"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = cleanText(searchParams.get("slug"), 100);
    const session = await getAuthenticatedSession();

    if (!session && (!slug || !PUBLIC_CONTENT.has(slug))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (slug) {
      const rows = await db.select().from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
      return NextResponse.json(rows[0] || null);
    }
    return NextResponse.json(await db.select().from(contentPages));
  } catch (error) {
    console.error("Fetch content error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 128_000);
    const slug = cleanText(body?.slug, 100);
    const title = cleanText(body?.title, 180);
    const content = typeof body?.content === "string" ? body.content.trim().slice(0, 100_000) : "";
    const metaDescription = cleanText(body?.metaDescription, 320);
    if (!slug || !title || !content || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Valid slug, title, and content are required" }, { status: 400 });
    }
    await db.insert(contentPages).values({ slug, title, content, metaDescription: metaDescription || null }).onConflictDoUpdate({
      target: contentPages.slug,
      set: { title, content, metaDescription: metaDescription || null, updatedAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
