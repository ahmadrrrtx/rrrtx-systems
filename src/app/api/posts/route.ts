import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";
import { notifyIndexNow } from "@/lib/indexnow";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const all = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImageUrl, tags, metaTitle, metaDescription, status, publishedAt } = body;
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 });
    }
    await db.insert(posts).values({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImageUrl: coverImageUrl || null,
      tags: tags || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      status: status || "draft",
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    if ((status || "draft") === "published") {
      void notifyIndexNow([`/blog/${slug}`, "/blog", "/sitemap.xml"]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["title", "excerpt", "content", "coverImageUrl", "tags", "metaTitle", "metaDescription", "status", "publishedAt"]);
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if ((updates.status && !["draft", "published"].includes(String(updates.status))) || (updates.coverImageUrl && !isSafePublicUrl(updates.coverImageUrl))) {
      return NextResponse.json({ error: "Status or cover image URL is invalid" }, { status: 400 });
    }

    if (typeof updates.publishedAt === "string" || typeof updates.publishedAt === "number") {
      updates.publishedAt = new Date(updates.publishedAt);
    }
    updates.updatedAt = new Date();

    await db.update(posts).set(updates).where(eq(posts.id, id));
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
    void notifyIndexNow([typeof body.slug === "string" ? `/blog/${body.slug}` : "/blog", "/blog", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.update(posts).set({ status: "draft", updatedAt: new Date() }).where(eq(posts.id, parseInt(id)));
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
