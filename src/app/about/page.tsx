import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";
import { createMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "About Our Engineering-First Product Studio",
  description:
    "Learn how RRRTX Systems designs and engineers custom ecommerce platforms and AI automations with clear ownership and measurable outcomes.",
  path: "/about",
});

export default function AboutPage() {
  return <><Navbar /><AboutPageClient /><Footer /></>;
}
