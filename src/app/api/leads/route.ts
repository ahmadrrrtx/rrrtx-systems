import { db } from "@/lib/db";
import { leads } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { sendLeadNotification } from "@/lib/notifications";
import { cleanText, enforceRateLimit, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "lead-submission", { limit: 8, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 24_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    if (cleanText(body.website, 200)) return NextResponse.json({ success: true }, { status: 202 });

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const company = cleanText(body.company, 160);
    const service = cleanText(body.service, 120);
    const budget = cleanText(body.budget, 80);
    const message = cleanText(body.message, 5_000);
    if (!name || !isValidEmail(email) || !service || !budget) {
      return NextResponse.json({ error: "Please complete all required fields with a valid email." }, { status: 400 });
    }

    await db.insert(leads).values({
      name,
      email,
      company: company || null,
      service,
      budget,
      message: message || null,
      status: "new",
      source: "website",
    });

    void sendLeadNotification({
      subject: `New project enquiry from ${name}`,
      lines: [["Name", name], ["Email", email], ["Company", company || "—"], ["Service", service], ["Budget", budget], ["Message", message || "—"]],
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    return NextResponse.json(await db.select().from(leads).orderBy(desc(leads.createdAt)));
  } catch (error) {
    console.error("Lead fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
