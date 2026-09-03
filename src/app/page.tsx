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
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    hero_cta_text: heroCtaText,
    hero_cta_link: heroCtaLink,
    problem_title: problemTitle,
    problem_desc: problemDesc,
    problem_bullets: problemBullets,
    trusted_integrations: trustedIntegrations,
    homepage_stats: homepageStats,
    homepage_stats_verified: homepageStatsVerified,
    tech_stack: techStack,
    about_heading: aboutHeading,
    about_description: aboutDescription,
  } = settings;

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
        <TrustBar
          brands={trustedIntegrations.length ? trustedIntegrations : undefined}
        />
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
        <TestimonialsSection />
      </div>
      <div data-reveal>
        <TeamSection />
      </div>
      <div data-reveal>
        <SecondaryServices />
      </div>
      <div data-reveal>
        <TechStack items={techStack.length ? techStack : undefined} />
      </div>
      <div data-reveal>
        <AboutPreview
          heading={aboutHeading || undefined}
          description={aboutDescription || undefined}
        />
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
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
