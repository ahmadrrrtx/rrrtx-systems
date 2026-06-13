import type { Metadata } from "next";
import { AboutPageClient } from "./about-client";

export const metadata: Metadata = {
  title: "About RRRTX SYSTEMS — Custom Ecommerce & AI Engineering Studio",
  description:
    "Engineering-first product studio building custom ecommerce websites and AI automation systems from scratch. No templates. No vendor lock-in. Full ownership.",
  openGraph: {
    title: "About RRRTX SYSTEMS — Custom Ecommerce & AI Engineering Studio",
    description: "Engineering-first product studio building custom ecommerce and AI automation systems from scratch.",
    url: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
