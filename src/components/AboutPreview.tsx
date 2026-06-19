"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight, Code2, Zap, Globe, Server } from "lucide-react";

const pillars = [
  {
    icon: Code2,
    title: "Engineering-First",
    description: "Clean, maintainable code built for scale. Every system is owned by you.",
  },
  {
    icon: Zap,
    title: "Conversion-Obsessed",
    description: "If it doesn't improve revenue, leads, or efficiency, we don't ship it.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description: "Edge-deployed, fast everywhere, and async-friendly across time zones.",
  },
  {
    icon: Server,
    title: "Full Ownership",
    description: "Source code, database, assets, and deployment — zero vendor lock-in.",
  },
];

interface AboutPreviewProps {
  heading?: string;
  description?: string;
}

export function AboutPreview({ heading, description }: AboutPreviewProps) {
  const activeHeading = heading || "We Build Systems. Not Websites.";
  const activeDescription =
    description ||
    "RRRTX SYSTEMS is an engineering-first product studio that builds custom ecommerce platforms and AI automation systems from scratch. No templates, no vendor lock-in, no borrowed themes — just clean architecture, real business logic, and full ownership of everything we deliver. We partner with founders and operators who've outgrown templates and need systems that actually convert visitors into revenue.";

  return (
    <SectionWrapper id="about" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Story */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4"
            >
              About RRRTX Systems
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            >
              {activeHeading.includes(".") ? (
                <>
                  {activeHeading.split(".")[0]}.{" "}
                  <span className="text-gradient">{activeHeading.split(".").slice(1).join(".").trim()}</span>
                </>
              ) : (
                activeHeading
              )}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base text-slate-400 leading-relaxed mb-8"
            >
              {activeDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Learn more about us <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Value pillars */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                className="group p-5 rounded-xl bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800/60 mb-3 group-hover:border-slate-700 transition-colors">
                  <pillar.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{pillar.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
