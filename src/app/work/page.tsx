import type { Metadata } from "next";
import { WorkPageClient } from "./work-client";
import { getPublicProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies — Custom Ecommerce & AI Systems",
  description:
    "Real projects, real code, real results. Ecommerce platforms, AI automation pipelines, and conversion systems built by RRRTX SYSTEMS.",
  openGraph: {
    title: "Portfolio & Case Studies — Custom Ecommerce & AI Systems | RRRTX SYSTEMS",
    description: "Real projects, real code, real results. Ecommerce platforms, AI automation pipelines, and conversion systems.",
    url: "/work",
  },
};

export default async function WorkPage() {
  const dbProjects = await getPublicProjects();
  const items = dbProjects.map((p) => {
    let metricsStr = "";
    try {
      const parsed = p.metrics ? JSON.parse(p.metrics) : null;
      if (parsed && typeof parsed === "object") {
        metricsStr = Object.values(parsed).join(" · ");
      } else if (typeof parsed === "string") {
        metricsStr = parsed;
      }
    } catch {
      metricsStr = p.metrics || "";
    }
    return {
      client: p.clientName || "Client",
      industry: p.industry || "",
      title: p.title,
      description: p.solution || p.challenge || p.results || "",
      image: p.imageUrl || "/assets/hero-core-visual.png",
      link: "/work",
      tags: [] as string[],
      metrics: metricsStr || (p.results || ""),
    };
  });

  return <WorkPageClient items={items.length ? items : undefined} />;
}
