import Link from "next/link";
import { ClipboardCheck, Calculator, Download, ArrowRight } from "lucide-react";

const tools = [
  { label: "Free Website Audit", href: "/audit", icon: ClipboardCheck, description: "Get a focused conversion and performance review of your current site.", accent: "from-cyan-400/20 to-blue-500/5", iconColor: "text-cyan-300" },
  { label: "ROI Calculator", href: "/roi", icon: Calculator, description: "Model a transparent improvement scenario using your own business inputs.", accent: "from-blue-400/20 to-purple-500/5", iconColor: "text-blue-300" },
  { label: "Free Resources", href: "/resources", icon: Download, description: "Browse instant and email-gated checklists, guides, and templates.", accent: "from-purple-400/20 to-pink-500/5", iconColor: "text-purple-300" },
];

export function ToolsCapsules() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      <div className="absolute inset-x-0 top-1/2 h-52 -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-500/[0.025] to-transparent blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700/60" />
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">Free Tools &amp; Resources</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700/60" />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.label} href={tool.href} className="premium-card group/tool flex min-h-40 items-start gap-4 overflow-hidden rounded-2xl p-5 sm:p-6">
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-35 transition-opacity duration-500 group-hover/tool:opacity-70`} aria-hidden="true" />
              <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-slate-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_14px_30px_-18px_rgba(34,211,238,.45)] ${tool.iconColor}`}>
                <tool.icon className="premium-icon h-5 w-5" aria-hidden="true" />
              </div>
              <div className="relative min-w-0 flex-1 pt-0.5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-[-0.015em] text-white transition-colors duration-300 group-hover/tool:text-cyan-300">{tool.label}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-[transform,color] duration-300 ease-[var(--ease-premium)] group-hover/tool:translate-x-1 group-hover/tool:text-cyan-300" aria-hidden="true" />
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
