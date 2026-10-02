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
  ["Local LLMs", "Workflow Pipelines", "Controlled Inference Cost"],
  ["Auto Scoring", "CRM Sync", "Follow-up Flows"],
];

const familyByIndex = ["build", "automate", "grow"] as const;

/** Supporting services folded into the architecture (same copy as before). */
const supportingServices: Array<{
  title: string;
  description: string;
  href: string;
  family: "automate" | "grow";
  gradient: string;
  wide?: boolean;
}> = [
  {
    title: "Website Rebuilds & Conversion Upgrades",
    description:
      "Your existing site is underperforming. We audit, rebuild, and optimize — turning dead traffic into qualified leads and sales.",
    href: "/services/rebuilds",
    family: "grow",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Chatbots & AI Assistants",
    description:
      "Intelligent support agents that understand context, answer questions, and escalate to humans when needed. Built on your data, not generic templates.",
    href: "/services/chatbots",
    family: "automate",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "SEO & AEO",
    description:
      "Technical foundation, structured data, and answer-engine optimization so your site ranks for what actually drives revenue — not vanity keywords.",
    href: "/services/seo",
    family: "grow",
    gradient: "from-cyan-500 to-blue-600",
    wide: true,
  },
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
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">
            Built for Revenue. Not Decoration.
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Every system we ship is engineered to convert, automate, and scale — from day one.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {services.map((service, i) => {
            const Icon = service.iconName
              ? getIcon(service.iconName)
              : fallbackIcons[i % fallbackIcons.length];
            const gradient = service.gradient || gradients[i % gradients.length];
            const details = microDetails[i % microDetails.length];
            const family = familyByIndex[i % familyByIndex.length];
            const featured = i < 2; // first two span wider

            return (
              <div
                key={service.title}
                className={featured ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <Link
                  href={service.href}
                  className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-950/50"
                >
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm border border-slate-800/40 rounded-2xl group-hover:border-slate-700/50 transition-colors duration-500" />

                  {/* Top gradient accent line */}
                  <div
                    className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-50 transition-opacity duration-500 rounded-full`}
                  />

                  {/* Hover glow */}
                  <div
                    className={`absolute -top-24 left-1/2 -translate-x-1/2 w-[240px] h-[240px] bg-gradient-to-br ${gradient} rounded-full blur-[100px] opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700`}
                  />

                  {/* Family tag */}
                  <span className={`family-tag family-tag--${family} group-hover:opacity-100 opacity-70 transition-opacity`}>{family.toUpperCase()}</span>

                  <div className="relative p-7 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} shadow-lg opacity-85 group-hover:opacity-100 transition-opacity duration-300`}>
                        <Icon className="premium-icon w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-slate-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2.5 group-hover:text-cyan-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto mb-5">
                      {details.map((detail) => (
                        <span
                          key={detail}
                          className="px-2.5 py-1 text-[10px] font-medium text-slate-300 rounded-md bg-slate-900/70 border border-slate-800/70"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                      Explore service
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Supporting service cards (static, real routes) */}
          {supportingServices.map((service, i) => (
            <div
              key={service.title}
              className={service.wide ? "lg:col-span-6" : "lg:col-span-2 md:col-span-1"}
            >
              <Link
                href={service.href}
                className={`group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 ${service.wide ? "" : "hover:-translate-y-1"}`}
              >
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm border border-slate-800/40 rounded-2xl group-hover:border-slate-700/60 transition-colors duration-500" />
                <div className={`absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r ${service.gradient} opacity-20 group-hover:opacity-50 transition-opacity duration-500`} />

                <span className={`family-tag family-tag--${service.family} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  {service.family.toUpperCase()}
                </span>

                <div className={`relative p-6 h-full ${service.wide ? "flex flex-col sm:flex-row sm:items-center gap-4" : "flex flex-col"}`}>
                  <div className="flex-1">
                    <span className="font-mono text-[11px] tracking-[0.12em] text-slate-500">
                      {String(services.length + i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-white mb-1.5 group-hover:text-cyan-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 sm:shrink-0">
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
