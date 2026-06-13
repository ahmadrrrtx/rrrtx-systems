import type { Metadata } from "next";
import { WorkPageClient } from "./work-client";

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

export default function WorkPage() {
  return <WorkPageClient />;
}
