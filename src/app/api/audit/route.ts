import { db } from "@/lib/db";
import { auditSubmissions } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { sendLeadNotification } from "@/lib/notifications";
import { cleanText, enforceRateLimit, isSafeHttpUrl, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    return NextResponse.json(await db.select().from(auditSubmissions).orderBy(desc(auditSubmissions.createdAt)));
  } catch (error) {
    console.error("Fetch audits error:", error);
    return NextResponse.json({ error: "Failed to fetch audits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "audit-request", { limit: 5, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 16_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    if (cleanText(body.website, 200)) return NextResponse.json({ success: true }, { status: 202 });

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const websiteUrl = cleanText(body.websiteUrl, 2_048);
    const businessType = cleanText(body.businessType, 80);
    const helpWith = cleanText(body.helpWith, 120);
    if (!name || !isValidEmail(email) || !isSafeHttpUrl(websiteUrl)) {
      return NextResponse.json({ error: "Please provide a valid name, email, and website URL." }, { status: 400 });
    }

    const scores = {
      status: "pending_engineer_review",
      websiteClarity: null,
      trustCredibility: null,
      conversionCapture: null,
      seoVisibility: null,
      performanceUX: null,
      systemsOpportunity: null,
    };
    const recommendations = [
      { area: "Clarity & conversion", status: "pending", note: "Review the offer, audience, calls to action, and form journey." },
      { area: "Performance & UX", status: "pending", note: "Review loading, mobile behavior, accessibility, and Core Web Vitals risks." },
      { area: "Search foundations", status: "pending", note: "Review indexability, metadata, semantic structure, and internal links." },
      { area: "Systems opportunity", status: "pending", note: `Review opportunities related to ${helpWith || "the submitted priority"}.` },
    ];

    await db.insert(auditSubmissions).values({ name, email, websiteUrl, businessType: businessType || null, helpWith: helpWith || null, scores: JSON.stringify(scores), recommendations: JSON.stringify(recommendations), createdAt: new Date() });
    void sendLeadNotification({
      subject: `New audit request from ${name}`,
      lines: [["Name", name], ["Email", email], ["Website", websiteUrl], ["Business type", businessType || "—"], ["Primary need", helpWith || "—"]],
    });
    return NextResponse.json({ success: true, status: "pending_engineer_review" }, { status: 201 });
  } catch (error) {
    console.error("Submit audit error:", error);
    return NextResponse.json({ error: "Failed to submit audit request" }, { status: 500 });
  }
}
