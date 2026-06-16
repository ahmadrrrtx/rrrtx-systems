import { db } from "@/lib/db";
import { calculatorSubmissions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-check";

export async function GET() {
  const auth = await requireAuth();
  if (auth) return auth;
  try {
    const all = await db.select().from(calculatorSubmissions).orderBy(desc(calculatorSubmissions.createdAt));
    return NextResponse.json(all);
  } catch (error) {
    console.error("Fetch calculator submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch calculator submissions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      monthlyLeads,
      conversionRate,
      averageValue,
      currentRevenue,
      timeSpentManual,
      costManual,
      expectedImprovement
    } = body;

    const leads = parseFloat(monthlyLeads) || 0;
    const rate = (parseFloat(conversionRate) || 0) / 100;
    const val = parseFloat(averageValue) || 0;
    const manualHours = parseFloat(timeSpentManual) || 0;
    const manualCost = parseFloat(costManual) || 0;
    const improvement = (parseFloat(expectedImprovement) || 15) / 100;

    // Formulas
    const currentConversions = leads * rate;
    const expectedConversions = leads * (rate * (1 + improvement));
    const newConversions = expectedConversions - currentConversions;
    
    const monthlyROIUplift = newConversions * val;
    const annualImpact = monthlyROIUplift * 12;
    const timeSavings = manualHours * improvement; // hours saved
    const estimatedLostRevenue = (leads * 0.15 - currentConversions) * val; // Estimate that 15% is optimal conversion, lost is optimal minus current

    const results = {
      lostRevenue: Math.max(0, Math.floor(estimatedLostRevenue)),
      conversionGain: Math.floor(monthlyROIUplift),
      timeSavings: Math.floor(timeSavings),
      roiUplift: Math.floor(monthlyROIUplift + (manualCost * improvement)),
      annualImpact: Math.floor((monthlyROIUplift + (manualCost * improvement)) * 12),
    };

    // Save lead submission to database
    await db.insert(calculatorSubmissions).values({
      name: name || null,
      email: email || null,
      monthlyLeads: leads,
      conversionRate: parseFloat(conversionRate) || 0,
      averageValue: val,
      currentRevenue: parseFloat(currentRevenue) || 0,
      timeSpentManual: manualHours,
      costManual: manualCost,
      expectedImprovement: parseFloat(expectedImprovement) || 15,
      results: JSON.stringify(results),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Calculator calculation error:", error);
    return NextResponse.json({ error: "Failed to process calculations" }, { status: 500 });
  }
}
