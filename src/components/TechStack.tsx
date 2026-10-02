import { SectionWrapper } from "./SectionWrapper";
import { PLATFORM_ICON_PATHS } from "@/lib/platform-icons";
import { STACK_NAME_TO_SLUG } from "./BrandIcon";
import { StackFlipCard } from "./StackFlipCard";

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
      </div>
    </SectionWrapper>
  );
}
