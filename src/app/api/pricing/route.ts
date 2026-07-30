import { db } from "@/lib/db";
import { pricingTiers } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { cleanText, readJsonBody } from "@/lib/request-security";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    const all = session?.role === "admin"
      ? await db.select().from(pricingTiers).orderBy(asc(pricingTiers.sortOrder))
      : await db.select().from(pricingTiers).where(eq(pricingTiers.isActive, true)).orderBy(asc(pricingTiers.sortOrder));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch pricing error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing tiers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request); if (auth) return auth;
  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 32_000);
    const slug = cleanText(body?.slug, 100); const title = cleanText(body?.title, 180);
    if (!slug || !title || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "Valid slug and title are required" }, { status: 400 });
    await db.insert(pricingTiers).values({
      slug, title,
      subtitle: cleanText(body?.subtitle, 240) || null,
      startingPrice: cleanText(body?.startingPrice, 100) || null,
      description: cleanText(body?.description, 1_000) || null,
      features: cleanText(body?.features, 10_000) || null,
      sortOrder: Number.isFinite(Number(body?.sortOrder)) ? Number(body?.sortOrder) : 0,
      isActive: true,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) { console.error("Create pricing error:", error); return NextResponse.json({ error: "Failed to create pricing tier" }, { status: 500 }); }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request); if (auth) return auth;
  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 32_000);
    const id = Number(body?.id); if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    const updates: Partial<typeof pricingTiers.$inferInsert> = {};
    if (typeof body?.slug === "string" && /^[a-z0-9-]+$/.test(body.slug)) updates.slug = body.slug;
    if (typeof body?.title === "string") updates.title = cleanText(body.title, 180);
    if (typeof body?.subtitle === "string") updates.subtitle = cleanText(body.subtitle, 240) || null;
    if (typeof body?.startingPrice === "string") updates.startingPrice = cleanText(body.startingPrice, 100) || null;
    if (typeof body?.description === "string") updates.description = cleanText(body.description, 1_000) || null;
    if (typeof body?.features === "string") updates.features = cleanText(body.features, 10_000) || null;
    if (typeof body?.isActive === "boolean") updates.isActive = body.isActive;
    if (Number.isFinite(Number(body?.sortOrder))) updates.sortOrder = Number(body?.sortOrder);
    if (!Object.keys(updates).length) return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    await db.update(pricingTiers).set(updates).where(eq(pricingTiers.id, id));
    revalidatePath("/pricing");
    return NextResponse.json({ success: true });
  } catch (error) { console.error("Update pricing error:", error); return NextResponse.json({ error: "Failed to update pricing tier" }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request); if (auth) return auth;
  try {
    const id = Number.parseInt(new URL(request.url).searchParams.get("id") || "", 10);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    await db.update(pricingTiers).set({ isActive: false }).where(eq(pricingTiers.id, id));
    revalidatePath("/pricing");
    return NextResponse.json({ success: true });
  } catch (error) { console.error("Delete pricing error:", error); return NextResponse.json({ error: "Failed to delete pricing tier" }, { status: 500 }); }
}
