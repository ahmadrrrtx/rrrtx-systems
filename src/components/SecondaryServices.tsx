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
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "Chatbots & AI Assistants",
    description:
      "Intelligent support agents that understand context, answer questions, and escalate to humans when needed. Built on your data, not generic templates.",
    href: "/services/chatbots",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Search,
    title: "SEO & AEO",
    description:
      "Technical foundation, structured data, and answer-engine optimization so your site ranks for what actually drives revenue — not vanity keywords.",
    href: "/services/seo",
    gradient: "from-emerald-500 to-cyan-500",
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
          {secondaryServices.map((service) => (
            <div
              key={service.title}
            >
              <Link
                href={service.href}
                className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* Glass background */}
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm border border-slate-800/40 rounded-2xl group-hover:border-slate-700/60 transition-colors duration-500" />

                {/* Top line */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${service.gradient} opacity-20 group-hover:opacity-50 transition-opacity duration-500`} />

                {/* Hover glow */}
                <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-[160px] h-[160px] bg-gradient-to-br ${service.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700`} />

                <div className="relative p-7">
                  <div className="flex items-start gap-5">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-cyan-400 transition-colors duration-300">
                        Learn more{" "}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
