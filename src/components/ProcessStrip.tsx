"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionWrapper } from "./SectionWrapper";
import { Search, Code, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    subtitle: "Audit & map",
    description:
      "Deep audit of your current stack, conversion leaks, and automation gaps. We map the real problem before writing a single line of code.",
    color: "text-cyan-400",
    ring: "border-cyan-500/40",
    glow: "shadow-cyan-500/10",
    dot: "bg-cyan-400",
  },
  {
    icon: Code,
    number: "02",
    title: "Build",
    subtitle: "Architecture & code",
    description:
      "Custom architecture from scratch. Your database, your logic, your integrations. No templates. No borrowed themes. Just clean, owned code.",
    color: "text-blue-400",
    ring: "border-blue-500/40",
    glow: "shadow-blue-500/10",
    dot: "bg-blue-400",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deploy",
    subtitle: "Ship & scale",
    description:
      "Edge-deployed on Vercel, Cloud Run, or your infrastructure. Fast, global, and ready to scale from day one.",
    color: "text-purple-400",
    ring: "border-purple-500/40",
    glow: "shadow-purple-500/10",
    dot: "bg-purple-400",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimize",
    subtitle: "Measure & tune",
    description:
      "We measure what matters. Conversion rates, system uptime, lead quality. Then we tune until the numbers speak louder than the design.",
    color: "text-pink-400",
    ring: "border-pink-500/40",
    glow: "shadow-pink-500/10",
    dot: "bg-pink-400",
  },
];

/* ── Desktop: horizontal connected nodes ──────────────────────── */
function DesktopProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="hidden lg:block relative">
      {/* Connector line */}
      <div className="absolute top-[44px] left-0 right-0 z-0 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <svg className="w-full h-[2px] overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.35" />
                <stop offset="33%" stopColor="rgb(96 165 250)" stopOpacity="0.35" />
                <stop offset="66%" stopColor="rgb(168 85 247)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(244 114 182)" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <motion.line
              x1="12.5%"
              y1="1"
              x2="87.5%"
              y2="1"
              stroke="url(#connGrad)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.6, ease: "easeOut", delay: 0.15 }}
            />
          </svg>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 relative z-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.18, duration: 0.5, ease: "easeOut" }}
            className="relative group"
          >
            {/* Node */}
            <div className="flex justify-center mb-7">
              <div className="relative">
                <div
                  className={`w-[56px] h-[56px] rounded-full border-[1.5px] ${step.ring} bg-[#020617] flex items-center justify-center transition-all duration-500 shadow-lg ${step.glow}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-950/80 flex items-center justify-center">
                    <step.icon className={`w-[18px] h-[18px] ${step.color}`} />
                  </div>
                </div>
                {/* Pulse ring on hover */}
                <div
                  className={`absolute -inset-1.5 rounded-full border ${step.ring} opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-1.5">
                Step {step.number}
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                {step.title}
              </h3>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-3">
                {step.subtitle}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px] mx-auto">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Mobile: vertical timeline ────────────────────────────────── */
function MobileProcess() {
  return (
    <div className="lg:hidden relative">
      <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-pink-500/20" />

      <div className="space-y-7">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative flex gap-5 group"
          >
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-full border-[1.5px] ${step.ring} bg-[#020617] flex items-center justify-center z-10 relative`}
              >
                <step.icon className={`w-4 h-4 ${step.color}`} />
              </div>
            </div>

            <div className="flex-1 pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-0.5">
                Step {step.number}
              </span>
              <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 mb-4">
            Our Process
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">
            From Problem to Production
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Four deliberate stages. Zero guesswork. Every engagement follows the same
            engineering-first pipeline.
          </p>
        </div>

        <DesktopProcess />
        <MobileProcess />
      </div>
    </SectionWrapper>
  );
}
