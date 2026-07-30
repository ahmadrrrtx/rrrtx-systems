import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    const query = db.select().from(testimonials);
    const all = session?.role === "admin"
      ? await query.orderBy(asc(testimonials.sortOrder))
      : await query.where(eq(testimonials.isActive, true)).orderBy(asc(testimonials.sortOrder));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { name, role, company, quote, rating, imageUrl, featured, sortOrder } = body;
    if (!name || !quote) {
      return NextResponse.json({ error: "Name and quote are required" }, { status: 400 });
    }
    await db.insert(testimonials).values({
      name,
      role: role || null,
      company: company || null,
      quote,
      rating: rating ? parseInt(rating) : 5,
      imageUrl: imageUrl || null,
      featured: featured ?? false,
      sortOrder: sortOrder ?? 0,
      isActive: true,
    });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["name", "role", "company", "quote", "rating", "imageUrl", "featured", "sortOrder", "isActive"]);
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if (updates.imageUrl && !isSafePublicUrl(updates.imageUrl)) {
      return NextResponse.json({ error: "Image URL must be a safe public URL" }, { status: 400 });
    }
    if (typeof updates.rating === "string") updates.rating = parseInt(updates.rating, 10);
    await db.update(testimonials).set(updates).where(eq(testimonials.id, id));
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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
    await db.update(testimonials).set({ isActive: false }).where(eq(testimonials.id, parseInt(id)));
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
