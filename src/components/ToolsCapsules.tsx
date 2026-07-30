import Link from "next/link";
import { ClipboardCheck, Calculator, Download, ArrowRight } from "lucide-react";

const tools = [
  {
    label: "Free Website Audit",
    href: "/audit",
    icon: ClipboardCheck,
    description: "Get a free conversion & performance audit of your current site.",
  },
  {
    label: "ROI Calculator",
    href: "/roi",
    icon: Calculator,
    description: "See exactly how much revenue a custom system can unlock.",
  },
  {
    label: "Free Resources",
    href: "/resources",
    icon: Download,
    description: "Browse instant and email-gated checklists, guides, and templates.",
  },
];

export function ToolsCapsules() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800/40 to-transparent" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 shrink-0">
            Free Tools &amp; Resources
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-slate-800/40 to-transparent" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.label}
            >
              <Link
                href={tool.href}
                className="group flex items-start gap-4 p-4 rounded-xl bg-slate-950/30 border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800/50 flex items-center justify-center group-hover:border-slate-700/60 transition-colors">
                  <tool.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5">
                    {tool.label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
