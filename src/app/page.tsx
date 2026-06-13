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
import { TeamSection } from "@/components/TeamSection";
import { SecondaryServices } from "@/components/SecondaryServices";
import { PricingSection } from "@/components/PricingSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { getPublicServices, getPublicProjects, getPublicPricing } from "@/lib/queries";

// Read live data on every request so dashboard edits appear immediately.
export const dynamic = "force-dynamic";

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

export default async function Home() {
  // Primary services for the homepage grid; fall back to defaults inside the component.
  const dbServices = await getPublicServices({ primaryOnly: true });
  const serviceItems = dbServices.map((s) => ({
    title: s.title,
    description: s.shortDescription || s.fullDescription || "",
    href: `/services/${s.slug}`,
    iconName: s.iconName,
  }));

  // Featured published projects for the homepage; fall back to defaults if none.
  const dbProjects = await getPublicProjects({ featuredOnly: true });
  const workItems = dbProjects.map((p) => {
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
      tags: [],
      metrics: metricsStr || (p.results || ""),
    };
  });

  // Active pricing tiers; fall back to defaults if none.
  const dbPricing = await getPublicPricing();
  const pricingItems = dbPricing.map((t) => ({
    name: t.title,
    range: t.startingPrice || "",
    description: t.subtitle || t.description || "",
    features: (t.features || "")
      .split(/\r?\n|,/)
      .map((f) => f.trim())
      .filter(Boolean),
    cta: "Get Started",
    popular: false,
  }));

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <TrustBar />
      <StatsBar />
      <ProblemSection />
      <ServicesGrid items={serviceItems.length ? serviceItems : undefined} />
      <ProcessStrip />
      <FeaturedWork items={workItems.length ? workItems : undefined} />
      <TestimonialsSection />
      <TeamSection />
      <SecondaryServices />
      <PricingSection items={pricingItems.length ? pricingItems : undefined} />
      <CTASection />
      <Footer />
    </main>
  );
}
