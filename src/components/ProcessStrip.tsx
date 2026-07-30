import type { CSSProperties } from "react";
import { Search, Code2, Rocket, BarChart3, ArrowRight } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

const steps = [
  { icon: Search, number: "01", title: "Discover", subtitle: "Audit & map", description: "Audit the current stack, conversion path, automation gaps, and delivery constraints before changing code.", accent: "text-cyan-300", border: "border-cyan-400/35", wash: "from-cyan-500/[0.1]", glow: "rgba(34,211,238,.48)" },
  { icon: Code2, number: "02", title: "Build", subtitle: "Architecture & code", description: "Engineer the smallest responsible solution around your business logic, data, and existing integrations.", accent: "text-blue-300", border: "border-blue-400/35", wash: "from-blue-500/[0.1]", glow: "rgba(96,165,250,.48)" },
  { icon: Rocket, number: "03", title: "Deploy", subtitle: "Ship & validate", description: "Release through controlled environments with testing, monitoring, documentation, and a clear rollback path.", accent: "text-purple-300", border: "border-purple-400/35", wash: "from-purple-500/[0.1]", glow: "rgba(167,139,250,.48)" },
  { icon: BarChart3, number: "04", title: "Optimize", subtitle: "Measure & tune", description: "Measure conversion, reliability, performance, and lead quality, then improve what the evidence supports.", accent: "text-pink-300", border: "border-pink-400/35", wash: "from-pink-500/[0.1]", glow: "rgba(244,114,182,.45)" },
];

export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-[320px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">Our Process</p>
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-white lg:text-4xl xl:text-5xl">From Problem to Production</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">Four deliberate stages. Clear decisions, measurable gates, and no mystery handoffs.</p>
        </header>

        <div className="premium-surface relative overflow-hidden rounded-3xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.018] to-transparent" aria-hidden="true" />
          <ol className="relative grid gap-5 lg:grid-cols-4 lg:gap-6">
            <div className="process-pipeline-line absolute z-0 lg:left-[11%] lg:right-[11%] lg:top-[2.75rem] lg:h-px" aria-hidden="true" />
            {steps.map((step, index) => {
              const nodeStyle = { "--node-glow": step.glow } as CSSProperties;
              return (
                <li key={step.title} className="process-step group/process relative z-10 flex items-start gap-5 lg:block lg:text-center">
                  <div className={`process-node relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${step.border} bg-slate-950/95 lg:mx-auto lg:h-[5.5rem] lg:w-[5.5rem] lg:rounded-3xl`} style={nodeStyle}>
                    <div className={`absolute inset-1.5 rounded-[inherit] bg-gradient-to-br ${step.wash} to-transparent opacity-70`} aria-hidden="true" />
                    <step.icon className={`premium-icon relative h-5 w-5 lg:h-6 lg:w-6 ${step.accent}`} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-1.5 text-[9px] font-bold text-slate-200 shadow-lg">{step.number}</span>
                  </div>

                  <div className="min-w-0 flex-1 rounded-2xl border border-slate-800/55 bg-slate-950/45 p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.035),0_16px_36px_-30px_rgba(0,0,0,.9)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-premium)] group-hover/process:-translate-y-1 group-hover/process:border-slate-600/70 group-hover/process:shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_24px_48px_-28px_rgba(59,130,246,.24)] lg:mt-7 lg:min-h-[12.5rem]">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${step.accent}`}>{step.subtitle}</p>
                      {index < steps.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 text-slate-500 transition-transform duration-300 group-hover/process:translate-x-1 lg:block" aria-hidden="true" />}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
