"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Bot, Target } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

type ServiceItem = {
  title: string;
  description: string;
  href: string;
  iconName?: string | null;
  gradient?: string;
};

// Fallback content — used when no active services exist in the database,
// so the homepage design never regresses.
const defaultServices: ServiceItem[] = [
  {
    title: "Custom Ecommerce",
    description:
      "Built-from-scratch online stores with real cart logic, payment flows, inventory management, and conversion architecture. No templates. No limits.",
    href: "/services/ecommerce",
    iconName: "ShoppingCart",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "AI Automations & Agents",
    description:
      "Custom agents that monitor, classify, summarize, and act on real business data. Running on your infrastructure, not someone else's API bill.",
    href: "/services/ai-automation",
    iconName: "Bot",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Lead Generation Systems",
    description:
      "Capture, qualify, and route leads automatically. Integrated forms, scoring, CRM handoffs, and follow-up sequences that actually convert.",
    href: "/services/lead-generation",
    iconName: "Target",
    gradient: "from-blue-500 to-cyan-500",
  },
];

const fallbackIcons = [ShoppingCart, Bot, Target];
const gradients = [
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-pink-600",
  "from-blue-500 to-cyan-500",
];

export function ServicesGrid({ items }: { items?: ServiceItem[] }) {
  const services = items && items.length > 0 ? items : defaultServices;

  return (
    <SectionWrapper id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
            What We Build
          </p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            Built for Revenue. Not Decoration.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.iconName ? getIcon(service.iconName) : fallbackIcons[i % fallbackIcons.length];
            const gradient = service.gradient || gradients[i % gradients.length];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  href={service.href}
                  className="group block h-full p-8 rounded-2xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-600/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} mb-6`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
