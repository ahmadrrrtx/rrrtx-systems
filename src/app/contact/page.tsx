import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { ContactPageClient } from "./contact-client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = createMetadata({
  title: "Book a Strategy Call",
  description:
    "Discuss your ecommerce, AI automation, lead generation, or conversion project with RRRTX Systems and receive a clear next step.",
  path: "/contact",
});

export default function ContactPage() {
  return <><Navbar /><ContactPageClient /><Footer /></>;
}
