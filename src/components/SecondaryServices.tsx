"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight, RefreshCw, MessageSquare, Search } from "lucide-react";

const secondaryServices = [
  {
    icon: RefreshCw,
    title: "Website Rebuilds & Conversion Upgrades",
    description:
      "Your existing site is underperforming. We audit, rebuild, and optimize — turning dead traffic into qualified leads and sales.",
    href: "/services/rebuilds",
  },
  {
    icon: MessageSquare,
    title: "Chatbots & AI Assistants",
    description:
      "Intelligent support agents that understand context, answer questions, and escalate to humans when needed. Built on your data, not generic templates.",
    href: "/services/chatbots",
  },
  {
    icon: Search,
    title: "SEO & AEO",
    description:
      "Technical foundation, structured data, and answer-engine optimization so your site ranks for what actually drives revenue — not vanity keywords.",
    href: "/services/seo",
  },
];

export function SecondaryServices() {
  return (
    <SectionWrapper className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-4">
            Everything Else You Need
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Supporting Systems
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {secondaryServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={service.href}
                className="group flex items-start gap-5 p-6 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  <service.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-cyan-400 transition-colors">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
