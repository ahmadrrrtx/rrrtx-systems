"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight, Code2, Zap, Globe, Server } from "lucide-react";

const pillars = [
  {
    icon: Code2,
    title: "Engineering-First",
    description:
      "We write clean, maintainable code built to scale. Every system is yours — source, data, and infrastructure.",
  },
  {
    icon: Zap,
    title: "Conversion-Obsessed",
    description:
      "Design is measurable. If it doesn't improve revenue, leads, or efficiency, it doesn't ship.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description:
      "Edge-deployed, sub-2s everywhere, async-friendly across time zones. Built for real traffic, not demos.",
  },
  {
    icon: Server,
    title: "Full Ownership",
    description:
      "Source code, database, assets, deployment — everything is yours. Zero vendor lock-in. Zero surprises.",
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
    "RRRTX SYSTEMS is an engineering-first product studio that builds custom ecommerce platforms and AI automation systems from scratch. We don't resell themes or rebrand templates — we architect production-grade systems with real business logic, clean databases, and edge deployments that you own completely. We partner with founders, operators, and scaling brands who need infrastructure that converts, automates, and grows with them.";

  return (
    <SectionWrapper id="about" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Story */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4"
            >
              About RRRTX Systems
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
            >
              {activeHeading.includes(".") ? (
                <>
                  {activeHeading.split(".")[0]}.{" "}
                  <span className="text-gradient">
                    {activeHeading.split(".").slice(1).join(".").trim()}
                  </span>
                </>
              ) : (
                activeHeading
              )}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="text-base text-slate-400 leading-relaxed mb-6"
            >
              {activeDescription}
            </motion.p>

            {/* Availability + credibility signal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.22 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-950/50 border border-slate-800/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-slate-400 font-medium">
                  Currently accepting new engagements
                </span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-950/50 border border-slate-800/30">
                <span className="text-[11px] text-slate-400 font-medium">
                  🌍 Working globally &middot; async-first
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28 }}
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.45 }}
                className="group p-5 rounded-xl bg-slate-950/40 border border-slate-800/30 hover:border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-800/50 mb-3 group-hover:border-slate-700/60 transition-colors">
                  <pillar.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{pillar.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
