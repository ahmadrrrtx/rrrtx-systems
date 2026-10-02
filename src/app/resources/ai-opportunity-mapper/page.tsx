import type { Metadata } from "next";
import AIOpportunityMapperClient from "./mapper-client";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "AI Opportunity Mapper",
  description:
    "Pick the function and the bottleneck — get a concrete automation pattern, the system components involved, and a sensible first step.",
  path: "/resources/ai-opportunity-mapper",
});

export default function AIOpportunityMapperPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "RRRTX AI Opportunity Mapper",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://rrrtx-systems.com/resources/ai-opportunity-mapper",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };
  return (
    <>
      <JsonLd id="schema-ai-opportunity-mapper" data={schema} />
      <Navbar />
      <AIOpportunityMapperClient />
      <Footer />
    </>
  );
}
