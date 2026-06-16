"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { X, AlertTriangle } from "lucide-react";

const defaultProblems = [
  "Your Shopify theme looks like every other store in your niche.",
  "AI chatbots were installed, but they don't actually convert visitors.",
  "Your 'automation' is a mess of Zapier spaghetti that breaks weekly.",
  "You paid for a 'custom' site and got a template with different colors.",
];

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
  const activeDesc = description || "Most agencies sell you a prettier template and call it custom. When you need to scale, integrate, or automate, you hit the same wall every time. You don't need a new theme. You need a system built around your business logic.";
  const activeBullets = bullets && bullets.length > 0 ? bullets : defaultProblems;

  return (
    <SectionWrapper id="problem" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              The Real Problem
            </motion.div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              {activeTitle}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {activeDesc}
            </p>
          </div>

          <div className="space-y-4">
            {activeBullets.map((problem, i) => (
              <motion.div
                key={`${problem}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-slate-950/60 border border-slate-800/60"
              >
                <div className="mt-0.5">
                  <X className="w-4 h-4 text-red-400/80" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
