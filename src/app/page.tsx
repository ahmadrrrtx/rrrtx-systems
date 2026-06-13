import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { StatsBar } from "@/components/StatsBar";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ProcessStrip } from "@/components/ProcessStrip";
import { FeaturedWork } from "@/components/FeaturedWork";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SecondaryServices } from "@/components/SecondaryServices";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Custom Ecommerce & AI Systems Built to Convert",
  description:
    "Premium custom ecommerce websites and AI automation systems built from scratch. Next.js, Python agents, conversion-first engineering. No templates. No limits.",
  openGraph: {
    title: "Custom Ecommerce & AI Systems Built to Convert | RRRTX SYSTEMS",
    description:
      "Premium custom ecommerce websites and AI automation systems built from scratch. Engineering-first product studio.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TrustBar />
      <StatsBar />
      <ProblemSection />
      <ServicesGrid />
      <ProcessStrip />
      <FeaturedWork />
      <TestimonialsSection />
      <SecondaryServices />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
