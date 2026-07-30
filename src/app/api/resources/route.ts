import { db } from "@/lib/db";
import { resources } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";
import { notifyIndexNow } from "@/lib/indexnow";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // If "all" is true, it is for the dashboard settings page, so check credentials
    if (all) {
      const auth = await requireAuth();
      if (auth) return auth;
      const rows = await db.select().from(resources).orderBy(asc(resources.sortOrder));
      return NextResponse.json(rows);
    }

    // Public list of active resources
    const active = await db
      .select()
      .from(resources)
      .where(eq(resources.isActive, true))
      .orderBy(asc(resources.sortOrder));
    return NextResponse.json(active);
  } catch (error) {
    console.error("Fetch resources error:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { title, description, coverImageUrl, category, fileType, downloadUrl, isGated, sortOrder } = body;

    if (!title || !isSafePublicUrl(downloadUrl) || (coverImageUrl && !isSafePublicUrl(coverImageUrl))) {
      return NextResponse.json({ error: "Title and safe download/image URLs are required" }, { status: 400 });
    }

    await db.insert(resources).values({
      title,
      description: description || null,
      coverImageUrl: coverImageUrl || null,
      category: category || "Guide",
      fileType: fileType || "PDF",
      downloadUrl,
      isGated: isGated ?? true,
      isActive: true,
      sortOrder: sortOrder ?? 0,
      createdAt: new Date(),
    });

    revalidatePath("/resources");
    revalidatePath("/sitemap.xml");
    void notifyIndexNow(["/resources", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["title", "description", "coverImageUrl", "category", "fileType", "downloadUrl", "isGated", "isActive", "sortOrder"]);
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if ((updates.downloadUrl && !isSafePublicUrl(updates.downloadUrl)) || (updates.coverImageUrl && !isSafePublicUrl(updates.coverImageUrl))) {
      return NextResponse.json({ error: "Download and image URLs must use a safe public path or HTTP(S)." }, { status: 400 });
    }

    await db.update(resources).set(updates).where(eq(resources.id, id));
    revalidatePath("/resources");
    revalidatePath("/sitemap.xml");
    void notifyIndexNow(["/resources", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update resource error:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
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
    await db.update(resources).set({ isActive: false }).where(eq(resources.id, parseInt(id)));
    revalidatePath("/resources");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
