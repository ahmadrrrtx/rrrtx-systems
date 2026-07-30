import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { ServicesPageClient } from "./services-client";
import { getPublicServices } from "@/lib/queries";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Custom Ecommerce, AI Automation & Lead Generation Services",
  description:
    "Explore custom ecommerce, AI automation, lead generation, conversion rebuild, chatbot, and SEO services from RRRTX Systems.",
  path: "/services",
});

export default async function ServicesPage() {
  const dbServices = await getPublicServices();
  const items = dbServices.map((s) => ({
    iconName: s.iconName,
    title: s.title,
    description: s.shortDescription || s.fullDescription || "",
    href: `/services/${s.slug}`,
    tags: [] as string[],
  }));

  return <><Navbar /><ServicesPageClient items={items.length ? items : undefined} /><Footer /></>;
}
