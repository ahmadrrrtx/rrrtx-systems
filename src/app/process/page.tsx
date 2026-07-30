import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { ProcessPageClient } from "./process-client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "Our Process — From Discovery to Production",
  description:
    "Discover, build, deploy, and optimize with a transparent engineering process designed around measurable outcomes and controlled delivery risk.",
  path: "/process",
});

export default function ProcessPage() {
  return <><Navbar /><ProcessPageClient /><Footer /></>;
}
