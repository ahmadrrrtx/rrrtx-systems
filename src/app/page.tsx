import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { IntegrationNetwork } from "@/components/IntegrationNetwork";
import { StatsBar } from "@/components/StatsBar";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ProcessStrip } from "@/components/ProcessStrip";
import { FeaturedWork } from "@/components/FeaturedWork";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { PeopleSection } from "@/components/PeopleSection";
import { TechStack } from "@/components/TechStack";
import { AIToolkit } from "@/components/AIToolkit";
import { PricingSection } from "@/components/PricingSection";
import { BlogTeaser } from "@/components/BlogTeaser";
import { HomeFAQSection } from "@/components/HomeFAQSection";
import { ToolsCapsules } from "@/components/ToolsCapsules";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import {
  getPublicServices,
  getPublicProjects,
  getPublicPosts,
  getSettings,
} from "@/lib/queries";
import { parseMetrics } from "@/lib/content-parsers";
import { createMetadata } from "@/lib/seo";

// Cached at the edge; dashboard mutations explicitly revalidate this route.
export const revalidate = 300;

export const metadata: Metadata = {
  ...createMetadata({
    title: "Custom Ecommerce & AI Systems Built to Convert",
    description:
      "Custom ecommerce platforms, AI automations, and lead generation systems engineered around your business. No generic templates. Full ownership.",
    path: "/",
  }),
  title: { absolute: "Custom Ecommerce & AI Systems Built to Convert | RRRTX SYSTEMS" },
};

const defaultHomeSettings = {
  hero_title: "",
  hero_subtitle: "",
  hero_cta_text: "",
  hero_cta_link: "",
  problem_title: "",
  problem_desc: "",
  problem_bullets: [] as string[],
  trusted_integrations: [] as string[],
  homepage_stats: [] as Array<{ icon: string; value: number; suffix: string; label: string }>,
  homepage_stats_verified: false,
  tech_stack: [] as Array<{ name: string; category: string }>,
  about_heading: "",
  about_description: "",
};

export default async function Home() {
  const shouldReadDatabase = Boolean(process.env.TURSO_DATABASE_URL) || process.env.NODE_ENV !== "production";
  const [dbServices, dbProjects, dbPosts, settings] = shouldReadDatabase
    ? await Promise.all([
        getPublicServices({ primaryOnly: true }),
        getPublicProjects({ featuredOnly: true }),
        getPublicPosts(),
        getSettings(defaultHomeSettings),
      ])
    : [[], [], [], defaultHomeSettings];

  const serviceItems = dbServices.map((service) => ({
    title: service.title,
    description: service.shortDescription || service.fullDescription || "",
    href: `/services/${service.slug}`,
    iconName: service.iconName,
  }));

  const workItems = dbProjects.map((project) => ({
    client: project.clientName || "Client",
    industry: project.industry || "",
    title: project.title,
    description: project.solution || project.challenge || project.results || "",
    image: project.imageUrl || "/assets/hero-core-visual.webp",
    link: `/work/${project.slug}`,
    tags: [] as string[],
    metrics: parseMetrics(project.metrics) || project.results || "",
  }));

  const {
    hero_title: heroTitleRaw,
    hero_subtitle: heroSubtitleRaw,
    hero_cta_text: heroCtaTextRaw,
    hero_cta_link: heroCtaLinkRaw,
    problem_title: problemTitleRaw,
    problem_desc: problemDescRaw,
    problem_bullets: problemBulletsRaw,
    trusted_integrations: trustedIntegrationsRaw,
    homepage_stats: homepageStatsRaw,
    homepage_stats_verified: homepageStatsVerified,
    tech_stack: techStackRaw,
    about_heading: aboutHeadingRaw,
    about_description: aboutDescriptionRaw,
  } = settings;

  // Production settings rows may hold legacy shapes — never let a non-string
  // or non-array reach a component that reads/iterates during prerender.
  const asText = (value: unknown) => (typeof value === "string" ? value : "");
  const problemBullets = Array.isArray(problemBulletsRaw) ? problemBulletsRaw : [];
  const trustedIntegrations = Array.isArray(trustedIntegrationsRaw) ? trustedIntegrationsRaw : [];
  const homepageStats = Array.isArray(homepageStatsRaw) ? homepageStatsRaw : [];
  const techStack = Array.isArray(techStackRaw) ? techStackRaw : [];
  const heroTitle = asText(heroTitleRaw);
  const heroSubtitle = asText(heroSubtitleRaw);
  const heroCtaText = asText(heroCtaTextRaw);
  const heroCtaLink = asText(heroCtaLinkRaw);
  const problemTitle = asText(problemTitleRaw);
  const problemDesc = asText(problemDescRaw);
  const aboutHeading = asText(aboutHeadingRaw);
  const aboutDescription = asText(aboutDescriptionRaw);

  return (
    <main className="relative">
      <Navbar />
      <div data-reveal>
        <Hero
          titleLines={heroTitle || undefined}
          subtitle={heroSubtitle || undefined}
          ctaText={heroCtaText || undefined}
          ctaLink={heroCtaLink || undefined}
        />
      </div>
      <div data-reveal>
        <IntegrationNetwork integrations={trustedIntegrations} />
      </div>
      {homepageStatsVerified && homepageStats.length > 0 && (
        <div data-reveal>
          <StatsBar stats={homepageStats} />
        </div>
      )}
      <div data-reveal>
        <ProblemSection
          title={problemTitle || undefined}
          description={problemDesc || undefined}
          bullets={problemBullets.length ? problemBullets : undefined}
        />
      </div>
      <div data-reveal>
        <ServicesGrid items={serviceItems.length ? serviceItems : undefined} />
      </div>
      <div data-reveal>
        <ProcessStrip />
      </div>
      <div data-reveal>
        <FeaturedWork items={workItems.length ? workItems : undefined} />
      </div>
      <div data-reveal>
        <TechStack items={techStack.length ? techStack : undefined} />
      </div>
      <div data-reveal>
        <AIToolkit />
      </div>
      <div data-reveal>
        <PeopleSection
          heading={aboutHeading || undefined}
          description={aboutDescription || undefined}
        />
      </div>
      <div data-reveal>
        <TestimonialsSection />
      </div>
      <div data-reveal>
        <PricingSection />
      </div>
      <div data-reveal>
        <ToolsCapsules />
      </div>
      <div data-reveal>
        <BlogTeaser posts={dbPosts.slice(0, 3)} />
      </div>
      <div data-reveal>
        <HomeFAQSection />
      </div>
      <div data-reveal>
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
