import { NextResponse } from "next/server";
import {
  getPublicPosts,
  getPublicPricing,
  getPublicProjects,
  getPublicServices,
  getPublicTeam,
  getPublicTestimonials,
  getSettings,
} from "@/lib/queries";
import { DEFAULT_RANK_TIERS, PARTNER_COMMISSION_DEFAULT } from "@/lib/partner-constants";

export const dynamic = "force-dynamic";

const PUBLIC_SETTING_KEYS = new Set([
  "chatbot_enabled",
  "chatbot_name",
  "chatbot_welcome",
  "chatbot_about",
  "chatbot_contact_cta",
  "contact_email",
]);

export async function GET() {
  try {
    const [allSettings, serviceRows, pricingRows, projectRows, testimonialRows, teamRows, postRows] = await Promise.all([
      getSettings({} as Record<string, unknown>),
      getPublicServices(),
      getPublicPricing(),
      getPublicProjects(),
      getPublicTestimonials(),
      getPublicTeam(),
      getPublicPosts(),
    ]);
    const settings = Object.fromEntries(
      Object.entries(allSettings).filter(([key]) => PUBLIC_SETTING_KEYS.has(key))
    );

    return NextResponse.json(
      {
        settings,
        services: serviceRows.map(({ title, slug, shortDescription }) => ({ title, slug, shortDescription })),
        pricing: pricingRows.map(({ title, startingPrice, description }) => ({ title, startingPrice, description })),
        projects: projectRows.slice(0, 5).map(({ title, clientName, industry, slug }) => ({ title, client: clientName, industry, slug })),
        testimonials: testimonialRows.slice(0, 3).map(({ name, role, quote }) => ({ name, role, quote })),
        team: teamRows.map(({ name, role }) => ({ name, role })),
        blog: postRows.slice(0, 3).map(({ title, slug }) => ({ title, slug })),
        partners: {
          commissionRate: `${Math.round(PARTNER_COMMISSION_DEFAULT * 100)}%`,
          ranks: DEFAULT_RANK_TIERS.map(({ key, label, minProjects, minRevenue, isAutomatic }) => ({ key, label, minProjects, minRevenue, isAutomatic })),
          applyUrl: "/partners/apply",
          loginUrl: "/partner/login",
          verifyUrl: "/verify",
          overviewUrl: "/partners",
        },
      },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" } }
    );
  } catch (error) {
    console.error("Chatbot data API error:", error);
    return NextResponse.json({ error: "Failed to load chatbot data" }, { status: 500 });
  }
}
