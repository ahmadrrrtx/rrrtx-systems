import type { Metadata } from "next";
import { ProcessPageClient } from "./process-client";

export const metadata: Metadata = {
  title: "Our Process — From Discovery to Production",
  description:
    "4-step process: Discover, Build, Deploy, Optimize. Custom ecommerce and AI systems built with measurable outcomes. Realistic timelines, milestone delivery.",
  openGraph: {
    title: "Our Process — From Discovery to Production | RRRTX SYSTEMS",
    description: "4-step process: Discover, Build, Deploy, Optimize. Custom ecommerce and AI systems with measurable outcomes.",
    url: "/process",
  },
};

export default function ProcessPage() {
  return <ProcessPageClient />;
}
