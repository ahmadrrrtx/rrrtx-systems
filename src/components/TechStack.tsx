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
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  // Row 2: Backend & Data
  { name: "Node.js", category: "Runtime" },
  { name: "Python", category: "AI & Scripts" },
  { name: "Turso", category: "Database" },
  { name: "Drizzle ORM", category: "ORM" },
  { name: "PostgreSQL", category: "Database" },
  // Row 3: Infrastructure & Tools
  { name: "Vercel", category: "Hosting" },
  { name: "Cloudflare", category: "CDN" },
  { name: "GitHub", category: "Version Control" },
  { name: "Stripe", category: "Payments" },
  { name: "WhatsApp API", category: "Messaging" },
];

export function TechStack({ items }: { items?: StackItem[] }) {
  const stack = items && items.length > 0 ? items : defaultStack;

  // Split into 3 rows
  const rowSize = Math.ceil(stack.length / 3);
  const rows = [
    stack.slice(0, rowSize),
    stack.slice(rowSize, rowSize * 2),
    stack.slice(rowSize * 2),
  ];

  const rowLabels = ["Frontend & Framework", "Backend & Data", "Infrastructure & Tools"];

  return (
    <SectionWrapper className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-4">
            Built With the Right Tools
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Our Stack
          </h2>
        </div>

        <div className="space-y-8">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx}>
              {/* Row label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800/60 to-transparent" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 shrink-0">
                  {rowLabels[rowIdx] || `Layer ${rowIdx + 1}`}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-slate-800/60 to-transparent" />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {row.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: rowIdx * 0.1 + i * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="group relative"
                  >
                    <div className="px-5 py-3 rounded-xl bg-slate-950/50 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-300 cursor-default">
                      {/* Subtle top accent */}
                      <div className="absolute top-0 left-2 right-2 h-[0.5px] bg-gradient-to-r from-transparent via-slate-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="text-center">
                        <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {tech.name}
                        </div>
                        <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">
                          {tech.category}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
