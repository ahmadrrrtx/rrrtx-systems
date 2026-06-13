"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";

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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
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
              transition={{ delay: i * 0.12 }}
              className={`relative flex flex-col rounded-2xl p-8 ${
                tier.popular
                  ? "bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-purple-500/30 shadow-lg shadow-purple-900/10"
                  : "bg-slate-950/40 border border-slate-800/50"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold uppercase tracking-wider text-white">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-slate-400">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-white">{tier.range}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  tier.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-900/20"
                    : "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white bg-slate-900/30"
                }`}
              >
                {tier.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
