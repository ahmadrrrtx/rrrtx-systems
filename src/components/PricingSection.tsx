import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Layers3, ShieldCheck } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

const outcomes = [
  { icon: Compass, text: "Clarify the highest-value problem before committing to a build" },
  { icon: Layers3, text: "Map scope, architecture, integrations, timeline, and delivery risk" },
  { icon: ShieldCheck, text: "Leave with a practical next step and no pressure to proceed" },
];

export function PricingSection() {
  return (
    <SectionWrapper id="engagement" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/[0.06] blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-[#020617] shadow-2xl shadow-purple-950/20"
        >
          <div className="absolute inset-0 pointer-events-none opacity-50" aria-hidden="true">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 p-7 sm:p-10 lg:p-14 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Start with clarity</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
                Book a <span className="text-gradient">Strategy Call</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
                Bring the system, conversion, or automation problem that is slowing your business down. We will identify the constraint, pressure-test the opportunity, and outline the safest path forward.
              </p>

              <div className="grid gap-4 mb-9">
                {outcomes.map((outcome) => (
                  <div key={outcome.text} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <outcome.icon className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    </div>
                    <span className="pt-1.5 leading-relaxed">{outcome.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/30">
                  Book a Strategy Call <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                  View engagement options
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-5">What to bring</p>
              <ul className="space-y-4">
                {["The business outcome you are targeting", "Where the current workflow or website breaks", "Known constraints, systems, and integrations", "Any timeline or launch dependency"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-6 border-t border-white/10 text-xs leading-relaxed text-slate-400">
                No generic pitch deck. No forced commitment. If a smaller fix is the right answer, we will say so.
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
