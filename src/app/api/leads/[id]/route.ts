import { db } from "@/lib/db";
import { leads, leadNotes } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    const rows = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const notes = await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
    return NextResponse.json({ lead: rows[0], notes });
  } catch (error) {
    console.error("Lead detail error:", error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    const body = await request.json();
    const { status, note, followUpDate } = body;
    if (status) {
      await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, leadId));
    }
    if (note) {
      await db.insert(leadNotes).values({
        leadId: leadId,
        note,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
