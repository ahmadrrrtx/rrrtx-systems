import type { Metadata } from "next";
import { WorkPageClient } from "./work-client";
import { getPublicProjects } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";
import { parseMetrics } from "@/lib/content-parsers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Portfolio & Case Studies",
  description: "Explore ecommerce platforms, AI automation pipelines, and conversion systems engineered by RRRTX Systems.",
  path: "/work",
});

export default async function WorkPage() {
  const dbProjects = await getPublicProjects();
  const items = dbProjects.map((project) => ({
    client: project.clientName || "Client",
    industry: project.industry || "",
    title: project.title,
    description: project.solution || project.challenge || project.results || "",
    image: project.imageUrl || "/assets/hero-core-visual.webp",
    link: `/work/${project.slug}`,
    tags: [] as string[],
    metrics: parseMetrics(project.metrics) || project.results || "",
  }));
  return <><Navbar /><WorkPageClient items={items.length ? items : undefined} /><Footer /></>;
}
