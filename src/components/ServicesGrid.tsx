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

const microDetails = [
  ["Custom Checkout", "Real-time Inventory", "Multi-currency"],
  ["Local LLMs", "Workflow Pipelines", "Zero API Cost"],
  ["Auto Scoring", "CRM Sync", "Follow-up Flows"],
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
            const Icon = service.iconName
              ? getIcon(service.iconName)
              : fallbackIcons[i % fallbackIcons.length];
            const gradient = service.gradient || gradients[i % gradients.length];
            const details = microDetails[i % microDetails.length];

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link
                  href={service.href}
                  className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                >
                  {/* Background with glass effect */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm border border-slate-800/50 rounded-2xl group-hover:border-slate-600/60 transition-colors duration-500" />

                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />

                  {/* Hover glow */}
                  <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-gradient-to-br ${gradient} rounded-full blur-[80px] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700`} />

                  <div className="relative p-8">
                    {/* Icon with glow */}
                    <div className="relative mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-500`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                      />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Micro detail tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {details.map((detail) => (
                        <span
                          key={detail}
                          className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded bg-slate-900/80 text-slate-500 border border-slate-800/50"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors duration-300">
                      Learn more{" "}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
