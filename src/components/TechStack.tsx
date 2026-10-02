import { SectionWrapper } from "./SectionWrapper";
import { PLATFORM_ICON_PATHS } from "@/lib/platform-icons";
import { STACK_NAME_TO_SLUG } from "./BrandIcon";
import { StackFlipCard } from "./StackFlipCard";
import { BrandIcon } from "./BrandIcon";
import { Lock, Webhook } from "lucide-react";

/**
 * Our Stack — logo-first flip cards.
 *
 * Same content contract as before: settings-managed `tech_stack` items
 * ({ name, category }) with the identical built-in fallback list. Only the
 * presentation changed: each card shows the official mark and reveals the
 * name/category on hover or tap (StackFlipCard).
 */

interface StackItem {
  name: string;
  category: string;
}

const defaultStack: StackItem[] = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind", category: "Styling" },
  { name: "Framer", category: "Motion" },
  { name: "Node.js", category: "Runtime" },
  { name: "Python", category: "AI & Scripts" },
  { name: "Turso", category: "Database" },
  { name: "Drizzle ORM", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Cloudflare", category: "CDN" },
  { name: "Vercel", category: "Hosting" },
  { name: "GitHub", category: "Version Control" },
  { name: "Stripe", category: "Payments" },
];

const FLOAT_DURATIONS = ["5.2s", "6.1s", "5.6s", "6.4s", "5.1s", "6s", "5.4s", "6.2s", "5.8s", "5.3s", "6.3s", "5.5s", "5.9s", "6.5s"];
const FLOAT_DELAYS = ["-.3s", "-1.2s", "-2.1s", "-.8s", "-3s", "-1.7s", "-2.6s", "-.5s", "-1.9s", "-2.9s", "-1.1s", "-.2s", "-2.3s", "-1.5s"];

function slugFor(name: string): string | undefined {
  return STACK_NAME_TO_SLUG[name.toLowerCase().trim()];
}

/* ── Extended-stack ticker strips (below the flip grid) ── */
type StripItem = { name: string; slug?: string; cat: string; glyph?: "https" | "webhooks" };
export const STRIPS: Array<{ label: string; sub: string; items: StripItem[] }> = [
  {
    label: "Frontend & Framework",
    sub: "Fast · Typed · Accessible",
    items: [
      { name: "Next.js", slug: "nextdotjs", cat: "Framework" },
      { name: "React", slug: "react", cat: "Library" },
      { name: "TypeScript", slug: "typescript", cat: "Language" },
      { name: "Tailwind", slug: "tailwindcss", cat: "Styling" },
      { name: "Framer", slug: "framer", cat: "Motion" },
      { name: "JavaScript", slug: "javascript", cat: "Language" },
      { name: "HTML5", slug: "html5", cat: "Markup" },
      { name: "CSS", slug: "css3", cat: "Styling" },
    ],
  },
  {
    label: "Backend & Data",
    sub: "APIs · Workflows · Data",
    items: [
      { name: "Node.js", slug: "nodedotjs", cat: "Runtime" },
      { name: "Python", slug: "python", cat: "AI & Scripts" },
      { name: "Turso", slug: "turso", cat: "Database" },
      { name: "Drizzle", slug: "drizzle", cat: "ORM" },
      { name: "PostgreSQL", slug: "postgresql", cat: "Database" },
      { name: "SQLite", slug: "sqlite", cat: "Embedded DB" },
      { name: "C", slug: "c", cat: "Systems" },
    ],
  },
  {
    label: "Infrastructure",
    sub: "Deployment · Delivery",
    items: [
      { name: "Cloudflare", slug: "cloudflare", cat: "CDN & Security" },
      { name: "Vercel", slug: "vercel", cat: "Hosting" },
      { name: "GitHub", slug: "github", cat: "Version Control" },
      { name: "Git", slug: "git", cat: "Version Control" },
      { name: "Stripe", slug: "stripe", cat: "Payments" },
      { name: "Docker", slug: "docker", cat: "Containers" },
      { name: "Nginx", slug: "nginx", cat: "Web Server" },
      { name: "HTTPS", glyph: "https", cat: "SSL / TLS" },
    ],
  },
  {
    label: "Automation & AI",
    sub: "Workflows · Intelligent Systems",
    items: [
      { name: "OpenAI", slug: "openai", cat: "Models" },
      { name: "Claude", slug: "claude", cat: "Reasoning" },
      { name: "Gemini", slug: "googlegemini", cat: "Multimodal" },
      { name: "Perplexity", slug: "perplexity", cat: "Answers" },
      { name: "Make.com", slug: "make", cat: "Automation" },
      { name: "n8n", slug: "n8n", cat: "Workflows" },
      { name: "Rust", slug: "rust", cat: "Performance" },
      { name: "Webhooks", glyph: "webhooks", cat: "Glue" },
    ],
  },
];

export function TechStack({ items }: { items?: StackItem[] }) {
  const stack = items?.length ? items : defaultStack;

  return (
    <SectionWrapper className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.035] blur-[110px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Built With the Right Tools</p>
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.025em] text-white lg:text-4xl">Our Stack</h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-300">
            Every layer is selected — never default. Fast, typed, maintainable, owned.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-slate-400">
            Every layer is chosen for performance, ownership and the specific system being built — never included because it is fashionable.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-5 lg:grid-cols-7" role="list" aria-label="Technologies RRRTX works with">
          {stack.map((item, index) => (
            <div key={`${item.name}-${item.category}`} role="listitem" style={{ "--i": index } as React.CSSProperties}>
              <StackFlipCard
                name={item.name}
                category={item.category}
                paths={PLATFORM_ICON_PATHS[slugFor(item.name) ?? ""]}
                floatDuration={FLOAT_DURATIONS[index % FLOAT_DURATIONS.length]}
                floatDelay={FLOAT_DELAYS[index % FLOAT_DELAYS.length]}
              />
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-3" aria-label="Extended technology stack by layer">
          {STRIPS.map((strip, si) => (
            <div key={strip.label} className="stack-strip" style={{ "--strip-i": si } as React.CSSProperties}>
              <div className="stack-strip-label">
                <b>{strip.label}</b>
                <small>{strip.sub}</small>
              </div>
              <div className="stack-strip-viewport">
                <div className={`stack-strip-track ${si % 2 ? "stack-strip-track--rev" : ""}`}>
                  {[...strip.items, ...strip.items].map((item, ii) => (
                    <span
                      key={`${item.name}-${ii}`}
                      className="stack-strip-chip"
                      aria-hidden={ii >= strip.items.length}
                    >
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

        <p className="mx-auto mt-8 max-w-xl text-center text-[13px] leading-relaxed text-slate-400">
          Not every project uses every technology. The stack is selected per system — the tool earns its place, or it isn&rsquo;t in the build.
        </p>
      </div>
    </SectionWrapper>
  );
}
