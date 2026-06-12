import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
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
  const auth = await requireAuth();
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.update(services).set(updates).where(eq(services.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(services).where(eq(services.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
