import { db } from "@/lib/db";
import { gatedLeads, resources } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    // If all is true, return gated leads for dashboard
    if (all) {
      const auth = await requireAuth();
      if (auth) return auth;

      const rows = await db
        .select({
          id: gatedLeads.id,
          name: gatedLeads.name,
          email: gatedLeads.email,
          createdAt: gatedLeads.createdAt,
          resourceTitle: resources.title,
        })
        .from(gatedLeads)
        .leftJoin(resources, eq(gatedLeads.resourceId, resources.id))
        .orderBy(desc(gatedLeads.createdAt));

      return NextResponse.json(rows);
    }

    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(resources)
      .where(eq(resources.id, parseInt(id)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const resource = rows[0];

    // If resource is not gated, let anyone fetch the download link!
    if (!resource.isGated) {
      return NextResponse.json({ downloadUrl: resource.downloadUrl });
    }

    return NextResponse.json({ error: "Gated resource. Submission required." }, { status: 403 });
  } catch (error) {
    console.error("Fetch resource download error:", error);
    return NextResponse.json({ error: "Failed to load download" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, resourceId } = body;

    if (!name || !email || !resourceId) {
      return NextResponse.json({ error: "Name, email, and resource ID are required" }, { status: 400 });
    }

    // Check if the resource actually exists and is active
    const rows = await db
      .select()
      .from(resources)
      .where(eq(resources.id, parseInt(resourceId)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const resource = rows[0];

    // Record the gated download lead submission in the database
    await db.insert(gatedLeads).values({
      name,
      email,
      resourceId: parseInt(resourceId),
      createdAt: new Date(),
    });

    // Successfully recorded, return the actual file download URL!
    return NextResponse.json({
      success: true,
      downloadUrl: resource.downloadUrl,
    });
  } catch (error) {
    console.error("Gated lead download error:", error);
    return NextResponse.json({ error: "Failed to record lead" }, { status: 500 });
  }
}
