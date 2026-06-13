import { db } from "@/lib/db";
import { contentPages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const rows = await db.select().from(contentPages).where(eq(contentPages.slug, slug)).limit(1);
      return NextResponse.json(rows[0] || null);
    }
    const all = await db.select().from(contentPages);
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch content error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const body = await request.json();
    const { slug, title, content, metaDescription } = body;
    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Slug, title, and content are required" }, { status: 400 });
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
