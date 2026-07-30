import { db } from "@/lib/db";
import { leadNotes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth) return auth;

  try {
    const { id } = await params;
    const leadId = parseInt(id);
    const notes = await db
      .select()
      .from(leadNotes)
      .where(eq(leadNotes.leadId, leadId))
      .orderBy(leadNotes.createdAt);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const { id } = await params;
    const leadId = parseInt(id);
    const body = await request.json();
    const { note, followUpDate } = body;

    if (!note) {
      return NextResponse.json({ error: "Note is required" }, { status: 400 });
    }

    await db.insert(leadNotes).values({
      leadId,
      note,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
