import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";
import { notifyIndexNow } from "@/lib/indexnow";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
    return NextResponse.json(allProjects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { slug, title, clientName, industry, challenge, solution, results, metrics, imageUrl, featured, status } = body;

    if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug) || !title || !["draft", "published"].includes(status || "draft") || (imageUrl && !isSafePublicUrl(imageUrl))) {
      return NextResponse.json({ error: "Valid slug, title, status, and image URL are required" }, { status: 400 });
    }

    await db.insert(projects).values({
      slug,
      title,
      clientName,
      industry,
      challenge,
      solution,
      results,
      metrics: JSON.stringify(metrics || {}),
      imageUrl,
      featured: featured ?? false,
      status: status || "draft",
    });

    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${slug}`);
    revalidatePath("/sitemap.xml");
    if ((status || "draft") === "published") {
      void notifyIndexNow([`/work/${slug}`, "/work", "/sitemap.xml"]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["title", "clientName", "industry", "challenge", "solution", "results", "metrics", "imageUrl", "featured", "status", "sortOrder"]);

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if ((updates.status && !["draft", "published"].includes(String(updates.status))) || (updates.imageUrl && !isSafePublicUrl(updates.imageUrl))) {
      return NextResponse.json({ error: "Status or image URL is invalid" }, { status: 400 });
    }

    if (updates.metrics) {
      updates.metrics = JSON.stringify(updates.metrics);
    }

    await db.update(projects).set(updates).where(eq(projects.id, id));
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/work/[slug]", "page");
    revalidatePath("/sitemap.xml");
    void notifyIndexNow([typeof body.slug === "string" ? `/work/${body.slug}` : "/work", "/work", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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

    await db.update(projects).set({ status: "draft", featured: false }).where(eq(projects.id, parseInt(id)));
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/work/[slug]", "page");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
