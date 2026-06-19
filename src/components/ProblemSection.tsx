"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { X, AlertTriangle, Check, ArrowRight } from "lucide-react";

const defaultProblems = [
  "Your Shopify theme looks like every other store in your niche.",
  "AI chatbots were installed, but they don't actually convert visitors.",
  "Your 'automation' is a mess of Zapier spaghetti that breaks weekly.",
  "You paid for a 'custom' site and got a template with different colors.",
];

const comparisonData = {
  template: {
    title: "Template Approach",
    items: [
      "Same design as competitors",
      "Plugin bloat slows load times",
      "No real business logic",
      "Vendor lock-in on every feature",
    ],
  },
  custom: {
    title: "RRRTX Systems Approach",
    items: [
      "Architecture built for your model",
      "Sub-2s loads, edge-deployed",
      "Real automation & AI integration",
      "You own everything, zero lock-in",
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
  const activeTitle = title || "Templates Aren't Systems.";
  const activeDesc =
    description ||
    "Most agencies sell you a prettier template and call it custom. When you need to scale, integrate, or automate, you hit the same wall every time. You don't need a new theme. You need a system built around your business logic.";
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
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/[0.06] text-red-400 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              The Real Problem
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            >
              {activeTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed"
            >
              {activeDesc}
            </motion.p>
          </div>

          <div className="space-y-3">
            {activeBullets.map((problem, i) => (
              <motion.div
                key={`${problem}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/40 hover:border-red-500/20 transition-all duration-300"
              >
                <div className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-red-400/80" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Before / After comparison strip */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Template side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-slate-950/40 border border-red-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-red-400/60" />
              <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                {comparisonData.template.title}
              </h4>
            </div>
            <ul className="space-y-3">
              {comparisonData.template.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <X className="w-3.5 h-3.5 text-red-400/50 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Custom side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-slate-950/40 border border-cyan-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                {comparisonData.custom.title}
              </h4>
            </div>
            <ul className="space-y-3">
              {comparisonData.custom.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="w-3.5 h-3.5 text-cyan-400/80 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
