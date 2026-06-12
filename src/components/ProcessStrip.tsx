"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { Search, Code, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    description: "Deep audit of your current stack, conversion leaks, and automation gaps. We map the real problem before writing a single line of code.",
  },
  {
    icon: Code,
    number: "02",
    title: "Build",
    description: "Custom architecture from scratch. Your database, your logic, your integrations. No templates. No borrowed themes. Just clean, owned code.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deploy",
    description: "Edge-deployed on Vercel, Cloud Run, or your infrastructure. Fast, global, and ready to scale from day one.",
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimize",
    description: "We measure what matters. Conversion rates, system uptime, lead quality. Then we tune until the numbers speak louder than the design.",
  },
];

export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative p-6 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-colors"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-4">
                Step {step.number}
              </div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 mb-4">
                <step.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
