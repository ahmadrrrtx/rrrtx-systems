import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";

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

export default function PricingPage() {
  return <PricingPageClient />;
}
