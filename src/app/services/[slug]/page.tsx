"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const serviceData: Record<string, {
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
    headline: "Fix What’s Broken. Scale What Works.",
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

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = serviceData[slug];

  if (!service) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <Navbar />
        <div className="pt-32 pb-24 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Service Not Found</h1>
          <Link href="/services" className="text-cyan-400 hover:text-cyan-300">
            View all services →
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              {service.title}
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {service.headline}
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-slate-800/50 bg-slate-950/40"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full aspect-[4/3] object-cover opacity-80"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-bold text-white">What You Get</h3>
              <ul className="space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/20 mt-4"
              >
                Discuss This Service <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
