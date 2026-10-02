import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Webhook } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { StackFlipCard } from "@/components/StackFlipCard";
import { STRIPS } from "@/components/TechStack";
import { BrandIcon } from "@/components/BrandIcon";
import { PLATFORM_ICON_PATHS } from "@/lib/platform-icons";

export const metadata: Metadata = createMetadata({
  title: "Our Stack — Every Layer Selected, Never Default",
  description:
    "The complete RRRTX Systems stack: frameworks, languages, data layers, infrastructure and AI tooling — selected per system, owned end to end.",
  path: "/stack",
});

/**
 * /stack — the full technology inventory behind RRRTX services.
 * Core items first (flip to reveal), then the extended stack as layer
 * strips, then what each service typically uses.
 */

const CORE = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind", category: "Styling" },
  { name: "Framer", category: "Motion" },
  { name: "Node.js", category: "Runtime" },
  { name: "Python", category: "AI & Scripts" },
  { name: "JavaScript", category: "Language" },
  { name: "Turso", category: "Database" },
  { name: "Drizzle", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "SQLite", category: "Embedded DB" },
  { name: "Cloudflare", category: "CDN" },
  { name: "Vercel", category: "Hosting" },
  { name: "GitHub", category: "Version Control" },
  { name: "Git", category: "Version Control" },
  { name: "Stripe", category: "Payments" },
  { name: "Docker", category: "Containers" },
  { name: "Nginx", category: "Web Server" },
  { name: "HTML5", category: "Markup" },
  { name: "CSS", category: "Styling" },
  { name: "C", category: "Systems" },
  { name: "Rust", category: "Performance" },
];

const EXTENDED = [
  { name: "OpenAI", category: "Models" },
  { name: "Claude", category: "Reasoning" },
  { name: "Gemini", category: "Multimodal" },
  { name: "Perplexity", category: "Answers" },
  { name: "Make.com", category: "Automation" },
  { name: "n8n", category: "Workflows" },
  { name: "Claude Code", category: "AI Agent" },
  { name: "Codex", category: "AI Agent" },
  { name: "VS Code", category: "Editor" },
  { name: "Figma", category: "Design" },
  { name: "Canva", category: "Design" },
  { name: "Adobe", category: "Design" },
  { name: "Webhooks", category: "Glue" },
  { name: "HTTPS", category: "SSL / TLS" },
  { name: "Google Cloud", category: "Cloud" },
];

const FLOAT_DURATIONS = ["5.2s", "6.1s", "5.6s", "6.4s", "5.1s", "6s", "5.4s", "6.2s"];
const FLOAT_DELAYS = ["-.3s", "-1.2s", "-2.1s", "-.8s", "-3s", "-1.7s", "-2.6s", "-.5s"];

const SERVICE_STACKS = [
  {
    service: "Custom Ecommerce",
    href: "/services/ecommerce",
    uses: ["Next.js", "React", "TypeScript", "Tailwind", "Node.js", "Stripe", "Turso", "Drizzle", "Cloudflare", "Vercel"],
  },
  {
    service: "AI Systems & Agents",
    href: "/services/ai-automation",
    uses: ["Python", "OpenAI", "Claude", "Gemini", "Turso", "Docker", "Webhooks"],
  },
  {
    service: "Automation & Workflow Engineering",
    href: "/services/automation-workflow-engineering",
    uses: ["Make.com", "n8n", "Webhooks", "HTTPS", "Python", "Node.js", "SQLite"],
  },
  {
    service: "Lead Generation Systems",
    href: "/services/lead-generation",
    uses: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Node.js", "Vercel", "Cloudflare"],
  },
  {
    service: "Graphic & Brand Design",
    href: "/services/graphic-design",
    uses: ["Figma", "Canva", "Adobe", "Framer", "Tailwind"],
  },
  {
    service: "Conversion Engineering & Website Rebuilds",
    href: "/services/rebuilds",
    uses: ["Next.js", "React", "TypeScript", "Tailwind", "Cloudflare", "GitHub"],
  },
  {
    service: "SEO & AEO",
    href: "/services/seo",
    uses: ["Next.js", "TypeScript", "Structured data", "Cloudflare", "Vercel"],
  },
];

export default function StackPage() {
  const all = [...CORE, ...EXTENDED];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RRRTX Systems technology stack",
    numberOfItems: all.length,
    itemListElement: all.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name })),
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-stack-page" data={schema} />
      <Navbar />
      <section className="relative overflow-hidden pb-24 pt-32 lg:pt-40">
        <div className="soft-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="absolute left-1/2 top-0 h-[340px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-14 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Our Stack</p>
            <h1 className="mb-4 text-3xl font-bold tracking-[-0.03em] text-white lg:text-5xl">
              Every layer is <span className="text-gradient">selected — never default.</span>
            </h1>
            <p className="text-base leading-relaxed text-slate-300 lg:text-lg">
              Fast, typed, maintainable, owned. Every layer is chosen for performance, ownership and the specific system being built — never included because it is fashionable.
            </p>
          </header>

          {/* Full flip grid */}
          <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9" role="list" aria-label="All technologies">
            {all.map((item, index) => (
              <div key={`${item.name}-${item.category}`} role="listitem" style={{ "--i": index } as React.CSSProperties}>
                <StackFlipCard
                  name={item.name}
                  category={item.category}
                  paths={PLATFORM_ICON_PATHS[slugFor(item.name)]}
                  floatDuration={FLOAT_DURATIONS[index % FLOAT_DURATIONS.length]}
                  floatDelay={FLOAT_DELAYS[index % FLOAT_DELAYS.length]}
                />
              </div>
            ))}
          </div>

          {/* Layer strips */}
          <div className="mt-12 space-y-3" aria-label="Stack by layer">
            {STRIPS.map((strip, si) => (
              <div key={strip.label} className="stack-strip" style={{ "--strip-i": si } as React.CSSProperties}>
                <div className="stack-strip-label">
                  <b>{strip.label}</b>
                  <small>{strip.sub}</small>
                </div>
                <div className="stack-strip-viewport">
                  <div className={`stack-strip-track ${si % 2 ? "stack-strip-track--rev" : ""}`}>
                    {[...strip.items, ...strip.items].map((item, ii) => (
                      <span key={`${item.name}-${ii}`} className="stack-strip-chip" aria-hidden={ii >= strip.items.length}>
                        {item.glyph === "https" ? (
                          <Lock className="h-3.5 w-3.5 text-cyan-300/80" aria-hidden="true" />
                        ) : item.glyph === "webhooks" ? (
                          <Webhook className="h-3.5 w-3.5 text-cyan-300/80" aria-hidden="true" />
                        ) : (
                          <BrandIcon paths={PLATFORM_ICON_PATHS[item.slug ?? ""]} className="h-3.5 w-3.5" />
                        )}
                        <b>{item.name}</b>
                        <small>{item.cat}</small>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Per-service stack map */}
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-white lg:text-3xl">The stack, per service</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_STACKS.map((entry) => (
                <Link
                  key={entry.service}
                  prefetch={false}
                  href={entry.href}
                  className="premium-card group/svc rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-white transition-colors group-hover/svc:text-cyan-300">{entry.service}</h3>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-all group-hover/svc:translate-x-1 group-hover/svc:text-cyan-300" aria-hidden="true" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.uses.map((use) => (
                      <span key={use} className="rounded-md border border-slate-800/70 bg-slate-900/70 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                        {use}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-12 max-w-xl text-center text-[13px] leading-relaxed text-slate-400">
            Not every project uses every technology. The stack is selected per system — the tool earns its place, or it isn&rsquo;t in the build.
          </p>

          <div className="mt-10 text-center">
            <Link
              prefetch={false}
              href="/contact"
              className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Discuss your system <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function slugFor(name: string): string {
  return STACK_PAGE_SLUGS[name.toLowerCase()] ?? "";
}

const STACK_PAGE_SLUGS: Record<string, string> = {
  "next.js": "nextdotjs",
  react: "react",
  typescript: "typescript",
  tailwind: "tailwindcss",
  framer: "framer",
  "node.js": "nodedotjs",
  python: "python",
  javascript: "javascript",
  turso: "turso",
  drizzle: "drizzle",
  postgresql: "postgresql",
  sqlite: "sqlite",
  cloudflare: "cloudflare",
  vercel: "vercel",
  github: "github",
  git: "git",
  stripe: "stripe",
  docker: "docker",
  nginx: "nginx",
  html5: "html5",
  css: "css3",
  c: "c",
  rust: "rust",
  openai: "openai",
  claude: "claude",
  gemini: "googlegemini",
  perplexity: "perplexity",
  "make.com": "make",
  n8n: "n8n",
  "claude code": "claude",
  codex: "openai",
  "vs code": "visualstudiocode",
  figma: "figma",
  canva: "canva",
  adobe: "adobe",
};
