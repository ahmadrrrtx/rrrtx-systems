import type { Metadata } from "next";
import AutomationReadinessClient from "./readiness-client";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "Automation Readiness Check",
  description:
    "Answer eight quick questions about your workflows and see how ready your business is for automation — and which systems to build first.",
  path: "/resources/automation-readiness-check",
});

export default function AutomationReadinessPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "RRRTX Automation Readiness Check",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://rrrtx-systems.com/resources/automation-readiness-check",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };
  return (
    <>
      <JsonLd id="schema-automation-readiness" data={schema} />
      <Navbar />
      <AutomationReadinessClient />
      <Footer />
    </>
  );
}
