import { AlertTriangle, Check, X } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

const defaultProblems = [
  'Your "custom" site is a template with different colors.',
  "Chatbots were installed — they don't convert visitors.",
  '"Automation" is Zapier spaghetti that breaks weekly.',
  "Scaling means bolting on another plugin — and another bill.",
];

interface Half {
  title: string;
  items: string[];
}

const comparisonData: { template: Half; custom: Half } = {
  template: {
    title: "The Template Approach",
    items: [
      "Familiar layouts instead of business-specific architecture",
      "Plugin and integration bloat",
      "Limited control over business logic",
      "Fragmented tools and workflows",
      "Vendor dependencies on every feature",
      "Performance compromises you inherit",
    ],
  },
  custom: {
    title: "The RRRTX Systems Approach",
    items: [
      "Architecture built around your business model",
      "Purpose-built frontend and backend",
      "Real integrations and automation",
      "Performance-conscious infrastructure",
      "Clear ownership of code and data",
      "Designed for ownership, portability and evolution",
    ],
  },
};

export function ProblemSection({
  title,
  description,
  bullets,
}: {
  title?: string;
  description?: string;
  bullets?: string[];
}) {
  const activeTitle = title || "Templates aren't systems.";
  const activeDesc =
    description ||
    "A prettier website doesn't fix a broken system. Businesses outgrow templates when the website, customer journey, data and operations stop working together. You don't need another layer of design sitting on top of the same problems — you need infrastructure built around how the business actually operates.";
  const activeBullets = bullets && bullets.length > 0 ? bullets : defaultProblems;

  return (
    <SectionWrapper id="problem" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header row */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/[0.06] text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Real Problem
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              {activeTitle}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">{activeDesc}</p>
          </div>

          <div className="space-y-3">
            {activeBullets.map((problem, i) => (
              <div
                key={`${problem}-${i}`}
                className="sym-card group flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/40 transition-all duration-300"
              >
                <div className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-red-400/80" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{problem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Template vs System — visual panels */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* A TEMPLATE — identical, isolated */}
          <div className="prob-panel relative overflow-hidden rounded-2xl border border-red-500/10 bg-slate-950/40 p-7">
            <span className="glow-node top-[18px] right-[22px]" aria-hidden="true" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-400/90 mb-6">A Template</p>
            <div className="grid grid-cols-3 gap-3" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="prob-wire h-12 rounded-lg border border-red-500/[0.14] bg-gradient-to-br from-slate-900/60 to-slate-950/60"
                  style={{ animationDelay: `${-(i * 0.45)}s` }}
                />
              ))}
            </div>
            <p className="mt-7 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-red-400/70">
              Identical <span className="text-slate-600">·</span> Isolated
            </p>
          </div>

          {/* A SYSTEM — connected, purpose-built */}
          <div className="prob-panel relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/40 p-7">
            <span className="glow-node glow-node--ok top-[18px] right-[22px]" aria-hidden="true" />
            <span className="glow-node glow-node--ok bottom-[30px] left-[26px] [animation-delay:-1.6s]" aria-hidden="true" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300 mb-6">A System</p>
            <div className="relative mx-auto max-w-[340px]" aria-hidden="true">
              <svg viewBox="0 0 340 190" className="w-full h-auto">
                <defs>
                  <radialGradient id="prob-hub-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(34,211,238,.5)" />
                    <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                  </radialGradient>
                </defs>
                {[
                  "M170,95 C130,95 120,42 84,40",
                  "M170,95 C210,95 220,42 256,40",
                  "M170,95 C120,95 90,90 46,92",
                  "M170,95 C220,95 250,90 294,92",
                  "M170,95 C130,95 120,148 84,150",
                  "M170,95 C210,95 220,148 256,150",
                ].map((d, i) => (
                  <path key={i} d={d} fill="none" stroke="rgba(34,211,238,.35)" strokeWidth="1.4" />
                ))}
                <circle cx="170" cy="95" r="34" fill="url(#prob-hub-glow)" />
                <circle cx="170" cy="95" r="10" fill="#22d3ee" className="prob-hub-dot" />
                {[[84, 40], [256, 40], [46, 92], [294, 92], [84, 150], [256, 150]].map(([cx, cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="12" fill="rgba(2,6,23,.9)" stroke="rgba(34,211,238,.55)" strokeWidth="1.4" />
                    <circle cx={cx} cy={cy} r="3" fill="rgba(103,232,249,.9)" style={{ animationDelay: `${-(i * 0.5)}s` }} className="prob-spoke-dot" />
                  </g>
                ))}
              </svg>
            </div>
            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
              Connected <span className="text-slate-600">·</span> Purpose-built
            </p>
          </div>
        </div>

        {/* Before / After comparison strip */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Template side */}
          <div className="p-6 rounded-2xl bg-slate-950/40 border border-red-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" aria-hidden="true" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-red-400/60" />
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                {comparisonData.template.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {comparisonData.template.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <X className="w-3.5 h-3.5 text-red-400/50 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Custom side */}
          <div className="cmp-good premium-surface relative overflow-hidden rounded-2xl border-cyan-400/15 p-6">
            <span className="glow-node glow-node--ok top-[18px] right-[22px]" aria-hidden="true" />
            <span className="glow-node glow-node--ok top-1/2 left-[14px] [animation-delay:-.9s]" aria-hidden="true" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" aria-hidden="true" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                {comparisonData.custom.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {comparisonData.custom.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing line */}
        <p className="mt-12 text-center text-base text-slate-300">
          The difference isn&rsquo;t the design.{" "}
          <b className="font-semibold text-white">It&rsquo;s what the system can do when your business needs it to do more.</b>
        </p>
      </div>
    </SectionWrapper>
  );
}
