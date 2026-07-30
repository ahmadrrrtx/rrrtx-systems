"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Bot, Target, RefreshCw, MessageSquare, Search, type LucideIcon } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

type ServiceItem = {
  icon?: LucideIcon;
  iconName?: string | null;
  title: string;
  description: string;
  href: string;
  tags: string[];
};

const allServices: ServiceItem[] = [
  {
    icon: ShoppingCart,
    title: "Custom Ecommerce",
    description: "Built-from-scratch online stores with real cart logic, payment flows, inventory management, and conversion architecture.",
    href: "/services/ecommerce",
    tags: ["Next.js", "Stripe", "Custom Cart", "Admin Dashboard"],
  },
  {
    icon: Bot,
    title: "AI Automations & Agents",
    description: "Custom agents that monitor, classify, summarize, and act on real business data. Running on your infrastructure.",
    href: "/services/ai-automation",
    tags: ["Python", "Local LLMs", "Slack", "APIs"],
  },
  {
    icon: Target,
    title: "Lead Generation Systems",
    description: "Capture, qualify, and route leads automatically. Integrated forms, scoring, CRM handoffs, and follow-up sequences.",
    href: "/services/lead-generation",
    tags: ["Forms", "CRM", "Scoring", "Email"],
  },
  {
    icon: RefreshCw,
    title: "Website Rebuilds & Conversion Upgrades",
    description: "Audit, rebuild, and optimize — turning dead traffic into qualified leads and sales.",
    href: "/services/rebuilds",
    tags: ["CRO", "A/B Testing", "Performance", "SEO"],
  },
  {
    icon: MessageSquare,
    title: "Chatbots & AI Assistants",
    description: "Intelligent support agents that understand context and escalate to humans when needed.",
    href: "/services/chatbots",
    tags: ["RAG", "Context", "Handoff", "Analytics"],
  },
  {
    icon: Search,
    title: "SEO & AEO",
    description: "Technical foundation, structured data, and answer-engine optimization for revenue-driving keywords.",
    href: "/services/seo",
    tags: ["Schema", "Core Web Vitals", "AEO", "Content"],
  },
];

export function ServicesPageClient({ items }: { items?: ServiceItem[] }) {
  const services = items && items.length > 0 ? items : allServices;
  return (
    <main className="relative min-h-screen bg-[#020617]">

      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Services
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Built for Revenue.{" "}
              <span className="text-gradient">Not Decoration.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              Every service is built around one outcome: your system converts better,
              works faster, and scales without breaking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon || getIcon(service.iconName);
              return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={service.href}
                  className="group block h-full p-8 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
