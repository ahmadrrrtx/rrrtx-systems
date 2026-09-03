// Admin — partner applications: list, review, approve (creates partner + setup code), reject.

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { partnerApplications, partners } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getAuthenticatedSession, requireAuth } from "@/lib/auth-check";
import { logPartnerAudit } from "@/lib/partner-data";
import { newPartnerId, newSetupCode } from "@/lib/partner-logic";
import { PARTNER_COMMISSION_DEFAULT } from "@/lib/partner-constants";
import { cleanText, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const status = new URL(request.url).searchParams.get("status");
    const rows = status
      ? await db.select().from(partnerApplications).where(eq(partnerApplications.status, status)).orderBy(desc(partnerApplications.createdAt))
      : await db.select().from(partnerApplications).orderBy(desc(partnerApplications.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const auth = await requireAuth(request);
  if (auth) return auth;

  try {
    const body = await readJsonBody<{ id?: unknown; status?: unknown; note?: unknown }>(request, 16_000);
    const id = typeof body?.id === "number" ? body.id : Number(body?.id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid application" }, { status: 400 });

    const rows = await db.select().from(partnerApplications).where(eq(partnerApplications.id, id)).limit(1);
    const application = rows[0];
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const session = await getAuthenticatedSession();
    const reviewer = session?.email || "admin";
    const note = typeof body?.note === "string" ? cleanText(body.note, 4000) : null;

    const status = body?.status;
    const validStatuses = ["pending", "under_review", "approved", "rejected"];
    if (typeof status !== "string" || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updates: Partial<typeof partnerApplications.$inferInsert> = {
      status,
      reviewedAt: new Date(),
      reviewedBy: reviewer,
      updatedAt: new Date(),
      ...(note !== null ? { notes: note } : {}),
    };
    await db.update(partnerApplications).set(updates).where(eq(partnerApplications.id, id));

    await logPartnerAudit({
      actorType: "admin",
      actorId: reviewer,
      action: "application_reviewed",
      entityType: "application",
      entityId: application.applicationId,
      meta: { status, applicationId: application.applicationId },
    });

    // On approval: create the partner account + one-time setup code.
    let setupCode: string | null = null;
    let approvedPartnerId: string | null = null;
    if (status === "approved") {
      const existingPartner = await db.select().from(partners).where(eq(partners.email, application.email)).limit(1);
      if (existingPartner[0]) {
        return NextResponse.json({ error: "A partner with this email already exists." }, { status: 409 });
      }

      let partnerId = newPartnerId();
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const clash = await db.select().from(partners).where(eq(partners.partnerId, partnerId)).limit(1);
        if (!clash[0]) break;
        partnerId = newPartnerId();
      }

      setupCode = newSetupCode();
      const setupTokenHash = await bcrypt.hash(setupCode, 12);
      const setupTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db.insert(partners).values({
        partnerId,
        referralCode: partnerId,
        applicationId: application.id,
        name: application.name,
        email: application.email,
        phone: application.phone,
        country: application.country,
        company: application.company,
        website: application.website,
        linkedin: application.linkedin,
        role: application.role,
        rank: "starter",
        commissionRate: PARTNER_COMMISSION_DEFAULT,
        status: "active",
        setupTokenHash,
        setupTokenExpiresAt,
      });
      approvedPartnerId = partnerId;

      await logPartnerAudit({
        actorType: "admin",
        actorId: reviewer,
        action: "partner_approved",
        entityType: "partner",
        entityId: partnerId,
        meta: { applicationId: application.applicationId, email: application.email },
      });
    }

    return NextResponse.json({ success: true, status, ...(approvedPartnerId ? { partnerId: approvedPartnerId, setupCode } : {}) });
  } catch (error) {
    console.error("Application update error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
