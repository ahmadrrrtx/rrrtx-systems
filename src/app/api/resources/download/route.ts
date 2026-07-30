import { db } from "@/lib/db";
import { gatedLeads, resources } from "@/lib/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { cleanText, enforceRateLimit, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("all") === "true") {
      const auth = await requireAuth();
      if (auth) return auth;
      const rows = await db
        .select({ id: gatedLeads.id, name: gatedLeads.name, email: gatedLeads.email, createdAt: gatedLeads.createdAt, resourceTitle: resources.title })
        .from(gatedLeads)
        .leftJoin(resources, eq(gatedLeads.resourceId, resources.id))
        .orderBy(desc(gatedLeads.createdAt));
      return NextResponse.json(rows);
    }

    const id = Number.parseInt(searchParams.get("id") || "", 10);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Valid resource ID is required" }, { status: 400 });
    const rows = await db.select().from(resources).where(and(eq(resources.id, id), eq(resources.isActive, true))).limit(1);
    const resource = rows[0];
    if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    if (resource.isGated) return NextResponse.json({ error: "Submission required" }, { status: 403 });
    return NextResponse.json({ downloadUrl: resource.downloadUrl });
  } catch (error) {
    console.error("Fetch resource download error:", error);
    return NextResponse.json({ error: "Failed to load download" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "resource-download", { limit: 12, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 12_000);
    const name = cleanText(body?.name, 120);
    const email = cleanText(body?.email, 254).toLowerCase();
    const resourceId = Number.parseInt(String(body?.resourceId || ""), 10);
    if (!name || !isValidEmail(email) || !Number.isInteger(resourceId) || resourceId <= 0) {
      return NextResponse.json({ error: "Valid name, email, and resource are required" }, { status: 400 });
    }

    const rows = await db.select().from(resources).where(and(eq(resources.id, resourceId), eq(resources.isActive, true))).limit(1);
    const resource = rows[0];
    if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

    if (resource.isGated) {
      await db.insert(gatedLeads).values({ name, email, resourceId, createdAt: new Date() });
    }
    return NextResponse.json({ success: true, downloadUrl: resource.downloadUrl });
  } catch (error) {
    console.error("Gated lead download error:", error);
    return NextResponse.json({ error: "Failed to unlock resource" }, { status: 500 });
  }
}
