import type { Metadata } from "next";
import AuditClient from "./audit-client";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "Free Website Systems & Conversion Audit",
  description:
    "Request a focused RRRTX Systems review of your website's clarity, conversion path, performance, SEO foundations, and automation opportunities.",
  path: "/audit",
});

export default function AuditPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Website Systems and Conversion Audit",
    description: "A focused review request covering website clarity, conversion, performance, SEO, and system opportunities.",
    provider: { "@id": "https://rrrtx-systems.com/#organization" },
    url: "https://rrrtx-systems.com/audit",
  };
  return (
    <>
      <JsonLd id="schema-audit-service" data={schema} />
      <Navbar />
      <AuditClient />
      <Footer />
    </>
  );
}
