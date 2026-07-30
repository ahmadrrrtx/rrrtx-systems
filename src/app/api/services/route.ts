import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { pickAllowedFields } from "@/lib/request-security";
import { revalidatePath } from "next/cache";
import { notifyIndexNow } from "@/lib/indexnow";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const publicSlug = url.searchParams.get("public") === "exists"
    ? url.searchParams.get("slug")?.trim()
    : null;

  if (publicSlug) {
    try {
      const rows = await db.select({ id: services.id }).from(services)
        .where(and(eq(services.slug, publicSlug), eq(services.isActive, true))).limit(1);
      return NextResponse.json({ exists: rows.length > 0 }, { headers: { "Cache-Control": "public, s-maxage=60" } });
    } catch {
      return NextResponse.json({ exists: false }, { status: 503 });
    }
  }

  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const allServices = await db.select().from(services).orderBy(services.sortOrder);
    return NextResponse.json(allServices);
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { slug, title, shortDescription, fullDescription, iconName, isPrimary, isAddon, sortOrder } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    await db.insert(services).values({
      slug,
      title,
      shortDescription,
      fullDescription,
      iconName,
      isPrimary: isPrimary ?? false,
      isAddon: isAddon ?? false,
      sortOrder: sortOrder ?? 0,
    });
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${slug}`);
    void notifyIndexNow([`/services/${slug}`, "/services", "/sitemap.xml"]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["title", "shortDescription", "fullDescription", "iconName", "isPrimary", "isAddon", "sortOrder", "isActive"]);

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.update(services).set(updates).where(eq(services.id, id));
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/services/[slug]", "page");
    void notifyIndexNow(["/services", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
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

    await db.update(services).set({ isActive: false }).where(eq(services.id, parseInt(id)));
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/services/[slug]", "page");
    void notifyIndexNow(["/services", "/sitemap.xml"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
