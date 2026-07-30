import type { CSSProperties, ComponentType } from "react";
import { Code2, Database, CloudCog } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

interface StackItem { name: string; category: string }
interface CapsuleProps extends StackItem { icon: ComponentType<{ className?: string }>; accent: string }

const defaultStack: StackItem[] = [
  { name: "Next.js", category: "Framework" }, { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" }, { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Runtime" }, { name: "Python", category: "AI & Scripts" },
  { name: "Turso", category: "Database" }, { name: "Drizzle ORM", category: "ORM" },
  { name: "PostgreSQL", category: "Database" }, { name: "Cloudflare", category: "CDN" },
  { name: "Vercel", category: "Hosting" }, { name: "GitHub", category: "Version Control" },
  { name: "Stripe", category: "Payments" }, { name: "WhatsApp API", category: "Messaging" },
];

const rowMeta = [
  { label: "Frontend & Framework", description: "Fast, typed, accessible interfaces", icon: Code2, accent: "text-cyan-300", direction: "left", duration: "31s" },
  { label: "Backend & Data", description: "Reliable APIs, workflows, and data", icon: Database, accent: "text-blue-300", direction: "right", duration: "35s" },
  { label: "Infrastructure & Integrations", description: "Deployment, delivery, and business systems", icon: CloudCog, accent: "text-purple-300", direction: "left", duration: "39s" },
] as const;

function Capsule({ name, category, icon: Icon, accent }: CapsuleProps) {
  return (
    <div className="group/pill relative inline-flex h-11 shrink-0 items-center gap-2.5 overflow-hidden rounded-full border border-slate-700/55 bg-slate-950/72 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.055),0_10px_26px_-18px_rgba(0,0,0,.9)] backdrop-blur-xl transition-[transform,border-color,box-shadow,background-color] duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-slate-500/80 hover:bg-slate-900/82 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.09),0_15px_35px_-18px_rgba(34,211,238,.28)]">
      <span className={`premium-icon flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.035] ${accent}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span>
      <span className="whitespace-nowrap text-xs font-semibold tracking-[-0.01em] text-slate-100">{name}</span>
      <span className="hidden whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 sm:inline">{category}</span>
      <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-300 group-hover/pill:opacity-100" aria-hidden="true" />
    </div>
  );
}

export function TechStack({ items }: { items?: StackItem[] }) {
  const stack = items?.length ? items : defaultStack;
  const rowSize = Math.ceil(stack.length / 3);
  const rows = [stack.slice(0, rowSize), stack.slice(rowSize, rowSize * 2), stack.slice(rowSize * 2)];

  return (
    <SectionWrapper className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-45" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.035] blur-[110px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Built With the Right Tools</p>
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.025em] text-white lg:text-4xl">Our Stack</h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-300">Every layer is selected for performance, ownership, and long-term maintainability.</p>
        </header>

        <div className="space-y-8">
          {rows.map((row, index) => {
            const meta = rowMeta[index];
            const tickerStyle = { "--ticker-duration": meta.duration } as CSSProperties;
            return (
              <section key={meta.label} aria-labelledby={`stack-row-${index}`} className="premium-surface overflow-hidden rounded-2xl py-5">
                <div className="mb-4 flex items-center gap-4 px-5 sm:px-7">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700/60" />
                  <div className="text-center">
                    <h3 id={`stack-row-${index}`} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">{meta.label}</h3>
                    <p className="mt-1 hidden text-[10px] text-slate-400 sm:block">{meta.description}</p>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700/60" />
                </div>
                <div className="tech-ticker" data-direction={meta.direction}>
                  <div className="tech-ticker-track" style={tickerStyle}>
                    {[0, 1].map((copy) => (
                      <div key={copy} className="tech-ticker-set" aria-hidden={copy === 1 ? "true" : undefined}>
                        {row.map((technology) => <Capsule key={`${copy}-${technology.name}-${technology.category}`} {...technology} icon={meta.icon} accent={meta.accent} />)}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
