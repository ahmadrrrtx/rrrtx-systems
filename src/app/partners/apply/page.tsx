import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApplyClient } from "./apply-client";

export const metadata: Metadata = createMetadata({
  title: "Apply — Become an RRRTX Partner",
  description:
    "Apply to join the RRRTX Partner Network. Tell us who you are and how you would introduce prospective clients for custom ecommerce, AI automation, and lead-generation systems.",
  path: "/partners/apply",
});

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <ApplyClient />
      <Footer />
    </main>
  );
}
