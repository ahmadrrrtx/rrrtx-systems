import { db } from "@/lib/db";
import { teamMembers } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const session = await getAuthenticatedSession();
    const query = db.select().from(teamMembers);
    const all = session?.role === "admin"
      ? await query.orderBy(asc(teamMembers.sortOrder))
      : await query.where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.sortOrder));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch team error:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { name, role, bio, imageUrl, linkedinUrl, twitterUrl, sortOrder } = body;
    if (!name || !role || (imageUrl && !isSafePublicUrl(imageUrl)) || (linkedinUrl && !isSafePublicUrl(linkedinUrl)) || (twitterUrl && !isSafePublicUrl(twitterUrl))) {
      return NextResponse.json({ error: "Name, role, and safe profile/image URLs are required" }, { status: 400 });
    }
    await db.insert(teamMembers).values({
      name,
      role,
      bio: bio || null,
      imageUrl: imageUrl || null,
      linkedinUrl: linkedinUrl || null,
      twitterUrl: twitterUrl || null,
      sortOrder: sortOrder ?? 0,
      isActive: true,
    });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create team member error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;
  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["name", "role", "bio", "imageUrl", "linkedinUrl", "twitterUrl", "sortOrder", "isActive"]);
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if ([updates.imageUrl, updates.linkedinUrl, updates.twitterUrl].some((url) => url && !isSafePublicUrl(url))) {
      return NextResponse.json({ error: "Profile and image URLs must be safe public URLs" }, { status: 400 });
    }
    await db.update(teamMembers).set(updates).where(eq(teamMembers.id, id));
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
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
    await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, parseInt(id)));
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
