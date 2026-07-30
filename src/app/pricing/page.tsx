import type { Metadata } from "next";
import { PricingPageClient } from "./pricing-client";
import { getPublicPricing } from "@/lib/queries";
import { parseStringList } from "@/lib/content-parsers";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createMetadata({
  title: "Engagement Models & Pricing",
  description: "Explore RRRTX Systems discovery, project, and ongoing growth engagements. Final scope and pricing are confirmed after requirements review.",
  path: "/pricing",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Why no fixed price list?", acceptedAnswer: { "@type": "Answer", text: "Every project has different scope, integrations, and complexity. The published ranges reflect comparable work, and an exact quote follows discovery." } },
    { "@type": "Question", name: "How long does a typical build take?", acceptedAnswer: { "@type": "Answer", text: "Discovery commonly takes one to two weeks. A full ecommerce or AI system is planned and delivered in milestones according to its validated scope." } },
    { "@type": "Question", name: "Do I own the code?", acceptedAnswer: { "@type": "Answer", text: "Yes. The agreed source code, database, assets, and deployment configuration are handed over according to the project agreement, without unnecessary vendor lock-in." } },
  ],
};

export default async function PricingPage() {
  const dbPricing = await getPublicPricing();
  const items = dbPricing.map((tier, index) => ({
    name: tier.title,
    range: tier.startingPrice || "Custom scope",
    description: tier.subtitle || tier.description || "",
    features: parseStringList(tier.features),
    cta: "Book a Strategy Call",
    popular: index === 1,
  }));
  return <><JsonLd id="schema-pricing-faq" data={faqSchema} /><Navbar /><PricingPageClient items={items.length ? items : undefined} /><Footer /></>;
}
