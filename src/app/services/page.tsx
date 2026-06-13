import type { Metadata } from "next";
import { ServicesPageClient } from "./services-client";

export const metadata: Metadata = {
  title: "Custom Ecommerce, AI Automation & Lead Generation Services",
  description:
    "Full-service digital product studio. Custom ecommerce stores, AI agents, lead systems, website rebuilds, chatbots, and SEO/AEO by RRRTX SYSTEMS.",
  openGraph: {
    title: "Custom Ecommerce, AI Automation & Lead Generation Services | RRRTX SYSTEMS",
    description: "Full-service digital product studio. Custom ecommerce, AI agents, lead systems, and more.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
