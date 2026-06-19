"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Shield } from "lucide-react";

type Tier = {
  name: string;
  range: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
};

const defaultTiers: Tier[] = [
  {
    name: "Discovery & Strategy",
    range: "$500 – $2,500",
    description: "Best when you need clarity before building.",
    features: [
      "Full stack & conversion audit",
      "Competitive & UX analysis",
      "Technical architecture plan",
      "AI automation opportunity map",
      "Roadmap & budget estimate",
    ],
    cta: "Book a Strategy Call",
    popular: false,
  },
  {
    name: "Project-Based Build",
    range: "$10,000 – $25,000",
    description: "Best for one-time ecommerce or AI system builds.",
    features: [
      "Custom codebase from scratch",
      "Database & API architecture",
      "Payment & integration setup",
      "AI agent or automation logic",
      "QA, testing & launch support",
      "30-day post-launch optimization",
    ],
    cta: "Start Your Project",
    popular: true,
  },
  {
    name: "Retainer & Growth",
    range: "$800+ / month",
    description: "Best for ongoing optimization and expansion.",
    features: [
      "Monthly CRO & A/B testing",
      "Feature additions & updates",
      "AI model tuning & retraining",
      "Performance monitoring & alerts",
      "Priority support & fast turnaround",
      "Quarterly growth strategy reviews",
    ],
    cta: "Discuss a Retainer",
    popular: false,
  },
];

export function PricingSection({ items }: { items?: Tier[] }) {
  const tiers = items && items.length > 0 ? items : defaultTiers;

  return (
    <SectionWrapper id="pricing" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background image — human + robot handshake */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.04]"
          style={{ backgroundImage: "url('/assets/pricing-handshake.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
            Engagement Models
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
            Transparent Pricing. No Surprises.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We don&apos;t hide behind custom quotes. These are real starting ranges based
            on what we&apos;ve shipped for clients like you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                tier.popular ? "shadow-xl shadow-purple-900/10" : ""
              }`}
            >
              <div
                className={`absolute inset-0 rounded-2xl ${
                  tier.popular
                    ? "bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-purple-500/25"
                    : "bg-slate-950/40 border border-slate-800/40"
                }`}
              />

              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              )}

              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-900/30">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="relative p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-sm text-slate-400">{tier.description}</p>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-800/40">
                  <span className="text-3xl font-bold text-white">{tier.range}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-0.5 shrink-0 w-5 h-5 rounded-md bg-cyan-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
                      : "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white bg-slate-900/30 hover:bg-slate-900/50"
                  }`}
                >
                  {tier.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-10 text-xs text-slate-500"
        >
          <Shield className="w-3.5 h-3.5 text-cyan-500/60" />
          All engagements include transparent scope, milestone deliverables, and full code ownership.
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
