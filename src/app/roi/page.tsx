import type { Metadata } from "next";
import ROICalculatorClient from "./roi-client";
import { createMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "Business ROI & Automation Calculator",
  description:
    "Estimate the potential revenue and operational impact of conversion improvements and workflow automation using transparent assumptions.",
  path: "/roi",
});

export default function ROICalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RRRTX Business ROI and Automation Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://rrrtx-systems.com/roi",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };
  return (
    <>
      <JsonLd id="schema-roi-calculator" data={schema} />
      <Navbar />
      <ROICalculatorClient />
      <Footer />
    </>
  );
}
