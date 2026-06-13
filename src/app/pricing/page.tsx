import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";
import { getPublicPricing } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transparent Pricing for Custom Ecommerce & AI Systems",
  description:
    "Real starting ranges for custom ecommerce builds ($10K-$25K), AI automation, and lead generation systems. No hidden fees. Discovery starts at $500.",
  openGraph: {
    title: "Transparent Pricing for Custom Ecommerce & AI Systems | RRRTX SYSTEMS",
    description: "Real starting ranges for custom ecommerce builds, AI automation, and lead generation systems.",
    url: "/pricing",
  },
};

export default async function PricingPage() {
  const dbPricing = await getPublicPricing();
  const items = dbPricing.map((t, idx) => ({
    name: t.title,
    range: t.startingPrice || "",
    description: t.subtitle || t.description || "",
    features: (t.features || "")
      .split(/\r?\n|,/)
      .map((f) => f.trim())
      .filter(Boolean),
    cta: "Get Started",
    popular: idx === 1, // highlight the middle tier, matching the default design
  }));

  return <PricingPageClient items={items.length ? items : undefined} />;
}
