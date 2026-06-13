import { db } from "@/lib/db";
import { pricingTiers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  try {
    const all = await db.select().from(pricingTiers).orderBy(asc(pricingTiers.sortOrder));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch pricing error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing tiers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const body = await request.json();
    const { slug, title, subtitle, startingPrice, description, features, sortOrder } = body;
    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }
    await db.insert(pricingTiers).values({
      slug,
      title,
      subtitle: subtitle || null,
      startingPrice: startingPrice || null,
      description: description || null,
      features: features || null,
      sortOrder: sortOrder ?? 0,
      isActive: true,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create pricing error:", error);
    return NextResponse.json({ error: "Failed to create pricing tier" }, { status: 500 });
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
    await db.update(pricingTiers).set(updates).where(eq(pricingTiers.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update pricing error:", error);
    return NextResponse.json({ error: "Failed to update pricing tier" }, { status: 500 });
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
    await db.delete(pricingTiers).where(eq(pricingTiers.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete pricing error:", error);
    return NextResponse.json({ error: "Failed to delete pricing tier" }, { status: 500 });
  }
}
