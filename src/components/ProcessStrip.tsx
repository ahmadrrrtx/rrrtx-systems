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
    description:
      "Deep audit of your current stack, conversion leaks, and automation gaps. We map the real problem before writing a single line of code.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgGlow: "from-cyan-500/10 to-cyan-500/0",
    dotBg: "bg-cyan-400",
  },
  {
    icon: Code,
    number: "02",
    title: "Build",
    description:
      "Custom architecture from scratch. Your database, your logic, your integrations. No templates. No borrowed themes. Just clean, owned code.",
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgGlow: "from-blue-500/10 to-blue-500/0",
    dotBg: "bg-blue-400",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deploy",
    description:
      "Edge-deployed on Vercel, Cloud Run, or your infrastructure. Fast, global, and ready to scale from day one.",
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgGlow: "from-purple-500/10 to-purple-500/0",
    dotBg: "bg-purple-400",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimize",
    description:
      "We measure what matters. Conversion rates, system uptime, lead quality. Then we tune until the numbers speak louder than the design.",
    color: "text-pink-400",
    borderColor: "border-pink-500/30",
    bgGlow: "from-pink-500/10 to-pink-500/0",
    dotBg: "bg-pink-400",
  },
];

function DesktopProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="hidden lg:block relative">
      {/* Connector path — a single SVG line that animates in */}
      <div className="absolute top-[40px] left-0 right-0 h-[2px] z-0">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <svg
            className="w-full h-[2px] overflow-visible"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="12.5%"
              y1="1"
              x2="87.5%"
              y2="1"
              stroke="url(#processGrad)"
              strokeWidth="1"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="processGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.4" />
                <stop offset="33%" stopColor="rgb(96 165 250)" stopOpacity="0.4" />
                <stop offset="66%" stopColor="rgb(168 85 247)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(244 114 182)" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 relative z-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.3 + i * 0.2,
              duration: 0.55,
              ease: "easeOut",
            }}
            className="relative group"
          >
            {/* Node circle */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Outer ring */}
                <div
                  className={`w-[52px] h-[52px] rounded-full border ${step.borderColor} bg-[#020617] flex items-center justify-center transition-all duration-500 group-hover:border-opacity-80`}
                >
                  {/* Inner glow ring */}
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-b ${step.bgGlow} flex items-center justify-center`}
                  >
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                </div>
                {/* Ambient glow */}
                <div
                  className={`absolute -inset-2 rounded-full ${step.dotBg} opacity-0 group-hover:opacity-[0.08] blur-xl transition-opacity duration-700`}
                />
              </div>
            </div>

            {/* Card */}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-2">
                Step {step.number}
              </span>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MobileProcess() {
  return (
    <div className="lg:hidden relative">
      {/* Vertical connector */}
      <div className="absolute left-[23px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-pink-500/20" />

      <div className="space-y-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative flex gap-5 group"
          >
            {/* Node */}
            <div className="relative shrink-0">
              <div
                className={`w-12 h-12 rounded-full border ${step.borderColor} bg-[#020617] flex items-center justify-center z-10 relative`}
              >
                <step.icon className={`w-4 h-4 ${step.color}`} />
              </div>
            </div>

            <div className="flex-1 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 block mb-1">
                Step {step.number}
              </span>
              <h3 className="text-base font-bold text-white mb-1.5">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProcessStrip() {
  return (
    <SectionWrapper
      id="process"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 mb-4">
            Our Process
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            From Problem to Production
          </h2>
        </div>

        <DesktopProcess />
        <MobileProcess />
      </div>
    </SectionWrapper>
  );
}
