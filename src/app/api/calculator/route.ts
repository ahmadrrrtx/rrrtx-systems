import { db } from "@/lib/db";
import { calculatorSubmissions } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";
import { cleanText, enforceRateLimit, isValidEmail, readJsonBody, validateRequestOrigin } from "@/lib/request-security";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    return NextResponse.json(await db.select().from(calculatorSubmissions).orderBy(desc(calculatorSubmissions.createdAt)));
  } catch (error) {
    console.error("Fetch calculator submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch calculator submissions" }, { status: 500 });
  }
}

function boundedNumber(value: unknown, min: number, max: number, fallback = 0) {
  const number = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(number) && number >= min && number <= max ? number : fallback;
}

export async function POST(request: Request) {
  const originError = validateRequestOrigin(request);
  if (originError) return originError;
  const rateError = enforceRateLimit(request, "roi-calculator", { limit: 20, windowMs: 60 * 60 * 1000 });
  if (rateError) return rateError;

  try {
    const body = await readJsonBody<Record<string, unknown>>(request, 16_000);
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const name = cleanText(body.name, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    if (email && !isValidEmail(email)) return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });

    const monthlyLeads = boundedNumber(body.monthlyLeads, 0, 100_000_000);
    const conversionRate = boundedNumber(body.conversionRate, 0, 100);
    const averageValue = boundedNumber(body.averageValue, 0, 1_000_000_000);
    const currentRevenue = boundedNumber(body.currentRevenue, 0, 100_000_000_000);
    const timeSpentManual = boundedNumber(body.timeSpentManual, 0, 100_000);
    const costManual = boundedNumber(body.costManual, 0, 100_000);
    const expectedImprovement = boundedNumber(body.expectedImprovement, 1, 100, 15);

    if (monthlyLeads <= 0 || averageValue <= 0) {
      return NextResponse.json({ error: "Monthly leads and average value must be greater than zero." }, { status: 400 });
    }

    const rate = conversionRate / 100;
    const improvement = expectedImprovement / 100;
    const currentConversions = monthlyLeads * rate;
    const modeledAdditionalConversions = currentConversions * improvement;
    const monthlyRevenueGain = modeledAdditionalConversions * averageValue;
    const timeSavings = timeSpentManual * improvement;
    const monthlyOperationalSavings = timeSavings * costManual;
    const monthlyImpact = monthlyRevenueGain + monthlyOperationalSavings;

    const results = {
      lostRevenue: Math.max(0, Math.round(monthlyRevenueGain)),
      conversionGain: Math.max(0, Math.round(monthlyRevenueGain)),
      timeSavings: Math.max(0, Math.round(timeSavings * 10) / 10),
      roiUplift: Math.max(0, Math.round(monthlyImpact)),
      annualImpact: Math.max(0, Math.round(monthlyImpact * 12)),
      currentMonthlyRevenue: Math.round(currentRevenue || currentConversions * averageValue),
      modeledConversionRate: Math.round(conversionRate * (1 + improvement) * 100) / 100,
      methodology: "Scenario estimate using the selected relative conversion lift and the same percentage reduction in manual work. It is not a guarantee of future performance.",
    };

    await db.insert(calculatorSubmissions).values({
      name: name || null,
      email: email || null,
      monthlyLeads,
      conversionRate,
      averageValue,
      currentRevenue,
      timeSpentManual,
      costManual,
      expectedImprovement,
      results: JSON.stringify(results),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Calculator calculation error:", error);
    return NextResponse.json({ error: "Failed to process calculations" }, { status: 500 });
  }
}
