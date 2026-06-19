"use client";

import { motion } from "framer-motion";
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
    dotColor: "bg-cyan-400",
    glowColor: "bg-cyan-500/20",
  },
  {
    icon: Code,
    number: "02",
    title: "Build",
    description:
      "Custom architecture from scratch. Your database, your logic, your integrations. No templates. No borrowed themes. Just clean, owned code.",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    glowColor: "bg-blue-500/20",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deploy",
    description:
      "Edge-deployed on Vercel, Cloud Run, or your infrastructure. Fast, global, and ready to scale from day one.",
    color: "text-purple-400",
    dotColor: "bg-purple-400",
    glowColor: "bg-purple-500/20",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimize",
    description:
      "We measure what matters. Conversion rates, system uptime, lead quality. Then we tune until the numbers speak louder than the design.",
    color: "text-pink-400",
    dotColor: "bg-pink-400",
    glowColor: "bg-pink-500/20",
  },
];

export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 mb-4">
            Our Process
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            From Problem to Production
          </h2>
        </div>

        {/* Desktop timeline layout */}
        <div className="hidden lg:block relative">
          {/* Connection line */}
          <div className="absolute top-[52px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-[1px]">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 origin-left"
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.5 }}
                className="relative group"
              >
                {/* Node dot on timeline */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-[#020617] flex items-center justify-center z-10 relative group-hover:border-slate-600 transition-colors duration-300">
                      <div className={`w-2.5 h-2.5 rounded-full ${step.dotColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                    {/* Node glow */}
                    <div className={`absolute inset-0 ${step.glowColor} rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-3`}>
                    Step {step.number}
                  </div>
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800/60 mb-4 group-hover:border-slate-700 transition-colors`}>
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: vertical timeline */}
        <div className="lg:hidden relative">
          {/* Vertical connection line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-pink-500/20" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex gap-5 group"
              >
                {/* Node */}
                <div className="relative shrink-0 mt-6">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-[#020617] flex items-center justify-center z-10 relative group-hover:border-slate-600 transition-colors">
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                </div>

                <div className="flex-1 p-5 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-300">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Step {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
