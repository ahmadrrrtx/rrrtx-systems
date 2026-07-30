import { db } from "@/lib/db";
import { promptBundles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { isSafePublicUrl, pickAllowedFields } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const bundles = await db.select().from(promptBundles).orderBy(promptBundles.createdAt);
    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Fetch prompt bundles error:", error);
    return NextResponse.json({ error: "Failed to fetch bundles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { title, description, category, githubUrl, price } = body;

    if (!title || (githubUrl && !isSafePublicUrl(githubUrl))) {
      return NextResponse.json({ error: "Title and a safe repository URL are required" }, { status: 400 });
    }

    await db.insert(promptBundles).values({
      title,
      description,
      category,
      githubUrl,
      price,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create bundle error:", error);
    return NextResponse.json({ error: "Failed to create bundle" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await request.json();
    const { id } = body;
    const updates = pickAllowedFields(body, ["title", "description", "category", "githubUrl", "price", "isActive"]);

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if (updates.githubUrl && !isSafePublicUrl(updates.githubUrl)) {
      return NextResponse.json({ error: "Repository URL must be a safe public URL" }, { status: 400 });
    }

    await db.update(promptBundles).set(updates).where(eq(promptBundles.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update bundle error:", error);
    return NextResponse.json({ error: "Failed to update bundle" }, { status: 500 });
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

    await db.update(promptBundles).set({ isActive: false }).where(eq(promptBundles.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete bundle error:", error);
    return NextResponse.json({ error: "Failed to delete bundle" }, { status: 500 });
  }
}
