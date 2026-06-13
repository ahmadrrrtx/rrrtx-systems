import type { Metadata } from "next";
import { ServicesPageClient } from "./services-client";
import { getPublicServices } from "@/lib/queries";

export const dynamic = "force-dynamic";

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

export default async function ServicesPage() {
  const dbServices = await getPublicServices();
  const items = dbServices.map((s) => ({
    iconName: s.iconName,
    title: s.title,
    description: s.shortDescription || s.fullDescription || "",
    href: `/services/${s.slug}`,
    tags: [] as string[],
  }));

  return <ServicesPageClient items={items.length ? items : undefined} />;
}
