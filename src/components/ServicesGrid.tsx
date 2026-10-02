import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

/**
 * What We Build — "Systems designed around how your business actually
 * operates." Primary cards come from the services table (same
 * getPublicServices({ primaryOnly: true }) contract); the visual layout,
 * family tags and capability tags follow the approved 2.0 design.
 * Services without a DB row fall back to the same content below.
 */

type ServiceCard = {
  title: string;
  description: string;
  href: string;
  slug: string;
  iconName: string;
  family: "build" | "automate" | "grow" | "design";
  tags: string[];
  cta?: string;
  size: "wide" | "third" | "row";
};

const serviceCards: ServiceCard[] = [
  {
    title: "Custom Ecommerce",
    description:
      "Built-from-scratch commerce systems with real business logic, conversion architecture and operational integrations.",
    href: "/services/ecommerce",
    slug: "ecommerce",
    iconName: "ShoppingCart",
    family: "build",
    tags: ["Custom checkout", "Real-time inventory", "Multi-currency", "Order workflows", "CRM / messaging"],
    size: "wide",
  },
  {
    title: "AI Systems & Agents",
    description:
      "AI systems that work with real business data instead of generic chatbot wrappers.",
    href: "/services/ai-automation",
    slug: "ai-automation",
    iconName: "Bot",
    family: "build",
    tags: ["Retrieval / RAG", "Classification", "Tool use", "Controlled inference", "Human escalation"],
    size: "wide",
  },
  {
    title: "Automation & Workflow Engineering",
    description:
      "Connect the systems your team already uses and remove repetitive operational work.",
    href: "/services/automation-workflow-engineering",
    slug: "automation-workflow-engineering",
    iconName: "Workflow",
    family: "automate",
    tags: ["Make.com", "n8n", "Webhooks", "API integrations", "CRM workflows", "Scheduled sync"],
    size: "third",
  },
  {
    title: "Lead Generation Systems",
    description: "Capture, qualify, route and follow up with leads automatically.",
    href: "/services/lead-generation",
    slug: "lead-generation",
    iconName: "Target",
    family: "grow",
    tags: ["Lead capture", "Qualification & scoring", "CRM sync", "Routing", "Follow-up flows"],
    size: "third",
  },
  {
    title: "Graphic & Brand Design",
    description:
      "Visual systems that make the business look credible and communicate clearly.",
    href: "/services/graphic-design",
    slug: "graphic-design",
    iconName: "Palette",
    family: "design",
    tags: ["Brand identity", "Social creatives", "Campaign assets", "Presentation design"],
    cta: "Start a design project",
    size: "third",
  },
  {
    title: "Conversion Engineering & Website Rebuilds",
    description:
      "Turn existing traffic into clearer journeys, stronger actions and measurable outcomes — rebuilds without losing what already works.",
    href: "/services/rebuilds",
    slug: "rebuilds",
    iconName: "RefreshCw",
    family: "grow",
    tags: ["UX audits", "Landing pages", "CRO", "Performance", "CTA architecture"],
    size: "row",
  },
  {
    title: "SEO & AEO",
    description:
      "Technical foundation, structured data and answer-engine optimization — visible in classic search and AI answers.",
    href: "/services/seo",
    slug: "seo",
    iconName: "Search",
    family: "grow",
    tags: ["Technical SEO", "Structured data", "Answer engines", "Content architecture"],
    size: "row",
  },
];

function cardMeta(slug: string, index: number): ServiceCard {
  const found = serviceCards.find((c) => c.slug === slug);
  if (found) return found;
  // CMS-added service without local metadata: sane defaults by position.
  const base = serviceCards[index % serviceCards.length];
  return { ...base, slug, title: "", description: "", href: `/services/${slug}`, tags: base.tags };
}

export function ServicesGrid({ items }: { items?: Array<{ title: string; description: string; href: string; iconName?: string | null; slug?: string }> }) {
  const cards: ServiceCard[] =
    items && items.length > 0
      ? items.map((item, i) => {
          const meta = cardMeta(item.slug ?? "", i);
          return {
            ...meta,
            title: item.title || meta.title,
            description: item.description || meta.description,
            href: item.href,
            iconName: item.iconName || meta.iconName,
          };
        })
      : serviceCards;

  let wideIndex = 0;
  let thirdIndex = 0;
  let rowIndex = 0;

  return (
    <SectionWrapper id="services" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[300px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/[0.03] blur-[120px]" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
            What We Build
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Systems designed around how<br className="hidden sm:block" /> your business <span className="text-gradient">actually operates.</span>
          </h2>
          <p className="text-sm lg:text-base text-slate-400 max-w-2xl mx-auto">
            We don&rsquo;t sell isolated pages. We build connected business systems — each engagement picks the right subset and wires it together.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {cards.map((service, i) => {
            const Icon = getIcon(service.iconName);
            const num = service.size === "row" ? (++rowIndex === 1 ? "06" : "+") : service.size === "wide" ? String(++wideIndex).padStart(2, "0") : String(2 + ++thirdIndex).padStart(2, "0");
            const isRow = service.size === "row";
            const isWide = service.size === "wide";

            return (
              <div
                key={`${service.slug}-${i}`}
                className={`svc-card ${isRow ? "lg:col-span-6" : isWide ? "lg:col-span-3" : "lg:col-span-2"} ${isRow ? "md:col-span-2" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Link
                  href={service.href}
                  prefetch={false}
                  className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-950/60"
                >
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm border border-slate-800/40 rounded-2xl group-hover:border-slate-700/50 transition-colors duration-500" />
                  <div className="absolute top-0 left-5 right-5 h-[2px] bg-gradient-to-r from-cyan-500/50 via-blue-500/40 to-purple-500/40 opacity-30 group-hover:opacity-70 transition-opacity duration-500 rounded-full" />

                  <span className={`family-tag family-tag--${service.family} opacity-70 group-hover:opacity-100 transition-opacity`}>
                    {service.family.toUpperCase()}
                  </span>

                  <div className={`relative h-full p-7 pt-12 flex flex-col ${isRow ? "sm:flex-row sm:items-center gap-5 sm:pt-7" : ""}`}>
                    <div className={isRow ? "flex-1 min-w-0" : ""}>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/[0.06]">
                          <Icon className="premium-icon h-4 w-4 text-cyan-300" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.14em] text-slate-500">{num}</span>
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 text-[10px] font-medium text-slate-300 rounded-md bg-slate-900/70 border border-slate-800/70 transition-colors duration-200 hover:border-cyan-500/40 hover:text-cyan-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 shrink-0 ${isRow ? "sm:self-center" : "mt-auto"}`}>
                      {service.cta || "Explore service"}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
