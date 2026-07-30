import { SectionWrapper } from "./SectionWrapper";

interface StackItem { name: string; category: string }

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
  { label: "Frontend & Framework", description: "Fast, typed, accessible interfaces" },
  { label: "Backend & Data", description: "Reliable APIs, workflows, and data" },
  { label: "Infrastructure & Integrations", description: "Deployment, delivery, and business systems" },
];

function Capsule({ name, category }: StackItem) {
  return <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800/40 hover:border-slate-600 transition-colors"><span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400">{name}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider hidden sm:inline">{category}</span></div>;
}

export function TechStack({ items }: { items?: StackItem[] }) {
  const stack = items?.length ? items : defaultStack;
  const rowSize = Math.ceil(stack.length / 3);
  const rows = [stack.slice(0, rowSize), stack.slice(rowSize, rowSize * 2), stack.slice(rowSize * 2)];

  return (
    <SectionWrapper className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-600/[0.02] rounded-full blur-[100px]" /></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <header className="text-center mb-14"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-4">Built With the Right Tools</p><h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Our Stack</h2><p className="text-sm text-slate-300 max-w-lg mx-auto">Every layer is selected for performance, ownership, and long-term maintainability.</p></header>
        <div className="space-y-9">
          {rows.map((row, index) => <section key={rowMeta[index]?.label} aria-labelledby={`stack-row-${index}`}><div className="text-center mb-4"><h3 id={`stack-row-${index}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{rowMeta[index]?.label}</h3><p className="text-xs text-slate-400 mt-1">{rowMeta[index]?.description}</p></div><div className="flex flex-wrap justify-center gap-2.5">{row.map((technology) => <Capsule key={`${technology.name}-${technology.category}`} {...technology} />)}</div></section>)}
        </div>
      </div>
    </SectionWrapper>
  );
}
