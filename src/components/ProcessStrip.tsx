import { SectionWrapper } from "./SectionWrapper";
import { Search, Code, Rocket, BarChart3 } from "lucide-react";

const steps = [
  { icon: Search, number: "01", title: "Discover", subtitle: "Audit & map", description: "Audit the current stack, conversion path, automation gaps, and delivery constraints before changing code.", color: "text-cyan-400", ring: "border-cyan-500/40" },
  { icon: Code, number: "02", title: "Build", subtitle: "Architecture & code", description: "Engineer the smallest responsible solution around your business logic, data, and existing integrations.", color: "text-blue-400", ring: "border-blue-500/40" },
  { icon: Rocket, number: "03", title: "Deploy", subtitle: "Ship & validate", description: "Release through controlled environments with testing, monitoring, documentation, and a clear rollback path.", color: "text-purple-400", ring: "border-purple-500/40" },
  { icon: BarChart3, number: "04", title: "Optimize", subtitle: "Measure & tune", description: "Measure conversion, reliability, performance, and lead quality, then improve what the evidence supports.", color: "text-pink-400", ring: "border-pink-500/40" },
];

export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-500/[0.02] rounded-full blur-[120px]" /></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <header className="text-center mb-16"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 mb-4">Our Process</p><h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">From Problem to Production</h2><p className="text-sm text-slate-300 max-w-md mx-auto">Four deliberate stages. Clear decisions, measurable gates, and no mystery handoffs.</p></header>
        <ol className="relative grid lg:grid-cols-4 gap-5 lg:gap-6">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] border-t border-dashed border-slate-700" aria-hidden="true" />
          {steps.map((step) => (
            <li key={step.title} className="relative rounded-2xl border border-slate-800/50 bg-slate-950/35 p-5 lg:text-center">
              <div className={`relative z-10 w-14 h-14 rounded-full border ${step.ring} bg-[#020617] flex items-center justify-center lg:mx-auto mb-5`}><step.icon className={`w-[18px] h-[18px] ${step.color}`} aria-hidden="true" /></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-1">Step {step.number}</span>
              <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-3">{step.subtitle}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}
