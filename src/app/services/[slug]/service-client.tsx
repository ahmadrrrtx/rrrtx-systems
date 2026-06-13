"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const serviceData: Record<string, {
  title: string;
  headline: string;
  description: string;
  features: string[];
  image: string;
}> = {
  ecommerce: {
    title: "Custom Ecommerce",
    headline: "Stores That Sell. Not Just Look Good.",
    description:
      "We build ecommerce platforms from scratch — no Shopify themes, no WooCommerce templates. Your own cart logic, checkout flow, payment integrations, and admin dashboard. Optimized for conversion, mobile performance, and real transaction volume.",
    features: [
      "Custom Next.js storefront with SSR/SSG for speed",
      "Real cart & checkout logic (not a plugin)",
      "Payment gateway integration (Stripe, PayPal, local methods)",
      "Inventory & order management dashboard",
      "WhatsApp / SMS order notifications",
      "Mobile-first, Core Web Vitals optimized",
      "SEO-ready architecture with structured data",
    ],
    image: "/assets/abstract-commerce-grid.png",
  },
  "ai-automation": {
    title: "AI Automations & Agents",
    headline: "Intelligence That Works While You Sleep.",
    description:
      "Custom AI agents built with Python and local LLMs. Monitor RSS feeds, classify leads, summarize data, and trigger actions across your stack. No OpenAI bills. No fragile no-code spaghetti. Just reliable automation that runs on your infrastructure.",
    features: [
      "Local LLM agents (Gemma, Llama, Mistral)",
      "RSS & API monitoring with intelligent filtering",
      "Slack, email, and CRM integrations",
      "Custom classification & summarization pipelines",
      "Runs on low-cost VPS ($7-15/month)",
      "Zero third-party API dependency",
      "Full code ownership and auditability",
    ],
    image: "/assets/ai-agent-network.png",
  },
  "lead-generation": {
    title: "Lead Generation Systems",
    headline: "Capture. Qualify. Convert. Automatically.",
    description:
      "End-to-end lead systems that capture visitors, score intent, route hot leads to your team, and nurture cold ones until they're ready. Built as part of your site — not a third-party widget that slows everything down.",
    features: [
      "Custom multi-step forms with validation",
      "Lead scoring based on behavior & demographics",
      "Automatic CRM routing & notifications",
      "Email/SMS follow-up sequences",
      "A/B tested landing pages & CTAs",
      "Analytics dashboard with conversion funnel",
      "Integration with WhatsApp Business API",
    ],
    image: "/assets/hero-core-visual.png",
  },
  rebuilds: {
    title: "Website Rebuilds & Conversion Upgrades",
    headline: "Fix What's Broken. Scale What Works.",
    description:
      "Your existing site looks fine but isn't converting. We audit the full funnel, rebuild the weak points, and optimize every touchpoint for revenue. From above-the-fold messaging to checkout flow friction.",
    features: [
      "Full conversion audit & heatmap analysis",
      "Above-the-fold messaging redesign",
      "Checkout / form friction removal",
      "Mobile experience overhaul",
      "Performance optimization (Lighthouse 90+)",
      "A/B testing infrastructure setup",
      "SEO & AEO foundation rebuild",
    ],
    image: "/assets/gradient-ambient-bg.png",
  },
  chatbots: {
    title: "Chatbots & AI Assistants",
    headline: "Support Agents That Actually Understand.",
    description:
      "Context-aware chatbots trained on your business data. They answer real questions, handle objections, and escalate to humans when needed. No generic templates. No frustrating loops. Just useful conversations.",
    features: [
      "RAG-based responses from your docs & data",
      "Multi-turn context memory",
      "Human handoff with full conversation history",
      "WhatsApp, web, and Messenger deployment",
      "Custom tone & brand voice training",
      "Analytics on resolution & escalation rates",
      "Continuous learning from conversation logs",
    ],
    image: "/assets/hero-holographic-hand.png",
  },
  seo: {
    title: "SEO & AEO",
    headline: "Rank for Revenue. Not Vanity.",
    description:
      "Technical SEO and Answer Engine Optimization built into your site architecture. Structured data, Core Web Vitals, topic clusters, and content that ranks for queries that actually drive business.",
    features: [
      "Technical SEO audit & remediation",
      "Schema.org structured data implementation",
      "Core Web Vitals optimization",
      "Topic cluster & pillar content strategy",
      "AEO (Answer Engine Optimization) for AI search",
      "Internal linking architecture",
      "Performance monitoring & reporting",
    ],
    image: "/assets/gradient-ambient-bg.png",
  },
};

export function ServicePageClient({ slug }: { slug: string }) {
  const service = serviceData[slug];

  if (!service) {
    return (
      <main className="relative min-h-screen bg-[#020617]">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
            <p className="text-slate-400">The service you are looking for does not exist.</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Service
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              {service.headline}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            <div>
              <p className="text-slate-400 leading-relaxed mb-8">
                {service.description}
              </p>
              <ul className="space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800/50">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Discuss This Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
