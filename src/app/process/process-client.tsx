"use client";

import { motion } from "framer-motion";
import { Search, Code, Rocket, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    description:
      "We start with a deep audit. Your current stack, conversion leaks, automation gaps, and growth bottlenecks. We map the real problem before touching any code.",
    deliverables: ["Stack & conversion audit", "Competitive analysis", "Automation opportunity map", "Budget & timeline estimate"],
  },
  {
    icon: Code,
    number: "02",
    title: "Build",
    description:
      "Custom architecture from scratch. Your database, your logic, your integrations. No templates. No borrowed themes. Just clean, owned code.",
    deliverables: ["Custom frontend & backend", "Database schema & API design", "Payment & integration setup", "AI logic & automation pipeline"],
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deploy",
    description:
      "Edge-deployed on Vercel, Cloud Run, or your infrastructure. Fast, global, and ready to scale from day one. SSL, monitoring, and backups included.",
    deliverables: ["Global CDN deployment", "Domain & SSL configuration", "Monitoring & alerting", "Performance benchmarking"],
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Optimize",
    description:
      "We measure what matters. Conversion rates, system uptime, lead quality. Then we tune until the numbers speak louder than the design.",
    deliverables: ["CRO & A/B testing", "Performance tuning", "AI model retraining", "Monthly strategy reviews"],
  },
];

export function ProcessPageClient() {
  return (
    <main className="relative min-h-screen bg-[#020617]">

      <section data-reveal className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Our Process
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              From Problem to{" "}
              <span className="text-gradient">Production.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              No black boxes. No mystery phases. Every step is defined, measurable, and
              built around shipping fast.
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="premium-card relative grid gap-8 rounded-3xl p-8 md:grid-cols-[1fr_2fr]"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Step {step.number}
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                </div>
                <div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
