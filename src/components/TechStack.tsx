"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";

interface StackItem {
  name: string;
  category: string;
}

const defaultStack: StackItem[] = [
  // Row 1: Frontend & Framework
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "UI Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Three.js", category: "3D / WebGL" },
  // Row 2: Backend & Data
  { name: "Node.js", category: "Runtime" },
  { name: "Python", category: "AI & Scripts" },
  { name: "Turso", category: "Edge DB" },
  { name: "Drizzle ORM", category: "Type-safe ORM" },
  { name: "SQLite", category: "Embedded DB" },
  { name: "Supabase", category: "BaaS" },
  // Row 3: Infrastructure & Tools
  { name: "Vercel", category: "Edge Hosting" },
  { name: "Cloudflare", category: "CDN & DNS" },
  { name: "GitHub", category: "CI / Version Control" },
  { name: "Stripe", category: "Payments" },
  { name: "WhatsApp API", category: "Messaging" },
  { name: "Make", category: "Workflow Automation" },
];

const rowMeta = [
  {
    label: "Frontend & Framework",
    sublabel: "The client layer — fast, typed, and interactive",
    marquee: true,
  },
  {
    label: "Backend & Data",
    sublabel: "The engine — APIs, databases, and intelligent agents",
    marquee: true,
  },
  {
    label: "Infrastructure & Tools",
    sublabel: "The backbone — deployment, security, and integrations",
    marquee: false,
  },
];

function Capsule({ name, category }: StackItem) {
  return (
    <div className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 cursor-default shrink-0">
      <span className="text-[12px] font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors duration-300 whitespace-nowrap">
        {name}
      </span>
      <span className="text-[8px] text-slate-600 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
        {category}
      </span>
    </div>
  );
}

function MarqueeCapsuleRow({ items, reverse }: { items: StackItem[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />
      <div className={`flex gap-3 whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee-slow"}`}>
        {doubled.map((tech, i) => (
          <Capsule key={`${tech.name}-${i}`} name={tech.name} category={tech.category} />
        ))}
      </div>
    </div>
  );
}

function StaticCapsuleRow({ items, delay }: { items: StackItem[]; delay: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {items.map((tech, i) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + i * 0.04, duration: 0.35 }}
        >
          <Capsule name={tech.name} category={tech.category} />
        </motion.div>
      ))}
    </div>
  );
}

export function TechStack({ items }: { items?: StackItem[] }) {
  const stack = items && items.length > 0 ? items : defaultStack;

  const rowSize = Math.ceil(stack.length / 3);
  const rows = [
    stack.slice(0, rowSize),
    stack.slice(rowSize, rowSize * 2),
    stack.slice(rowSize * 2),
  ];

  return (
    <SectionWrapper className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-600/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-4">
            Built With the Right Tools
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Our Stack</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Every layer is chosen for performance, ownership, and long-term
            maintainability. No bloat. No vendor lock-in.
          </p>
        </div>

        <div className="space-y-8">
          {rows.map((row, rowIdx) => {
            const meta = rowMeta[rowIdx];
            return (
              <div key={rowIdx}>
                {/* Row header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800/40 to-transparent" />
                  <div className="text-center shrink-0 px-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 block">
                      {meta?.label || `Layer ${rowIdx + 1}`}
                    </span>
                    <span className="text-[9px] text-slate-700 hidden sm:block">
                      {meta?.sublabel || ""}
                    </span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-slate-800/40 to-transparent" />
                </div>

                {/* Marquee rows for frontend & backend on desktop, static wrap everywhere on mobile */}
                {meta?.marquee ? (
                  <>
                    <div className="hidden md:block">
                      <MarqueeCapsuleRow items={row} reverse={rowIdx === 1} />
                    </div>
                    <div className="md:hidden">
                      <StaticCapsuleRow items={row} delay={rowIdx * 0.08} />
                    </div>
                  </>
                ) : (
                  <StaticCapsuleRow items={row} delay={rowIdx * 0.08} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
