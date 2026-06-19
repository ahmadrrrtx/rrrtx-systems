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
import { TechStack } from "@/components/TechStack";
import { PricingSection } from "@/components/PricingSection";
import { AboutPreview } from "@/components/AboutPreview";
import { BlogTeaser } from "@/components/BlogTeaser";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import {
  getPublicServices,
  getPublicProjects,
  getPublicPricing,
  getPublicPosts,
  getSetting,
} from "@/lib/queries";

// Read live data on every request so dashboard edits appear immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Custom Ecommerce & AI Systems Built to Convert | RRRTX SYSTEMS",
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
      metrics: metricsStr || p.results || "",
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

  // Published blog posts for the teaser (dashboard-driven via Blog manager)
  const dbPosts = await getPublicPosts();

  // Fetch customizable Homepage settings from siteSettings key-value store
  const heroTitle = await getSetting<string>("hero_title", "");
  const heroSubtitle = await getSetting<string>("hero_subtitle", "");
  const heroCtaText = await getSetting<string>("hero_cta_text", "");
  const heroCtaLink = await getSetting<string>("hero_cta_link", "");

  const problemTitle = await getSetting<string>("problem_title", "");
  const problemDesc = await getSetting<string>("problem_desc", "");
  const problemBullets = await getSetting<string[]>("problem_bullets", []);

  const trustedIntegrations = await getSetting<string[]>("trusted_integrations", []);
  const homepageStats = await getSetting<any[]>("homepage_stats", []);

  // Tech stack from dashboard
  const techStack = await getSetting<{ name: string; category: string }[]>(
    "tech_stack",
    []
  );

  // About section from dashboard
  const aboutHeading = await getSetting<string>("about_heading", "");
  const aboutDescription = await getSetting<string>("about_description", "");

  return (
    <main className="relative">
      <Navbar />
      <Hero
        titleLines={heroTitle || undefined}
        subtitle={heroSubtitle || undefined}
        ctaText={heroCtaText || undefined}
        ctaLink={heroCtaLink || undefined}
      />
      <TrustBar
        brands={trustedIntegrations.length ? trustedIntegrations : undefined}
      />
      <StatsBar stats={homepageStats.length ? homepageStats : undefined} />
      <ProblemSection
        title={problemTitle || undefined}
        description={problemDesc || undefined}
        bullets={problemBullets.length ? problemBullets : undefined}
      />
      <ServicesGrid items={serviceItems.length ? serviceItems : undefined} />
      <ProcessStrip />
      <FeaturedWork items={workItems.length ? workItems : undefined} />
      <TestimonialsSection />
      <TeamSection />
      <SecondaryServices />
      <TechStack items={techStack.length ? techStack : undefined} />
      <AboutPreview
        heading={aboutHeading || undefined}
        description={aboutDescription || undefined}
      />
      <PricingSection items={pricingItems.length ? pricingItems : undefined} />
      <BlogTeaser posts={dbPosts.slice(0, 3)} />
      <CTASection />
      <Footer />
    </main>
  );
}
