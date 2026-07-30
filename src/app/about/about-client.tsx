"use client";

import { motion } from "framer-motion";
import { Globe, Zap, Code2, Server, ArrowRight } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Code2,
    title: "Engineering-First",
    description: "We write clean, maintainable code. Every system is built to be understood, extended, and owned by you.",
  },
  {
    icon: Zap,
    title: "Conversion-Obsessed",
    description: "Design is measurable. If it doesn't improve revenue, leads, or efficiency, we don't ship it.",
  },
  {
    icon: Globe,
    title: "Global by Default",
    description: "Edge-deployed, fast everywhere, and async-friendly. We work with clients across time zones without friction.",
  },
  {
    icon: Server,
    title: "You Own Everything",
    description: "Source code, database, assets, and deployment. No vendor lock-in. No hidden dependencies. Full transparency.",
  },
];

export function AboutPageClient() {
  return (
    <main className="relative min-h-screen bg-[#020617]">

      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              About
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              We Build Systems.{" "}
              <span className="text-gradient">Not Websites.</span>
            </h1>
            <div className="space-y-4 text-lg text-slate-400 leading-relaxed">
              <p>
                RRRTX SYSTEMS is a product engineering studio focused on one thing: building
                digital commerce and AI automation systems that actually convert.
              </p>
              <p>
                We don&apos;t use templates. We don&apos;t resell Shopify themes. We architect
                custom platforms from the ground up — using Next.js, modern databases like Turso,
                and edge deployment on Vercel or Cloud Run.
              </p>
              <p>
                Our AI agents are built with Python, local LLMs, and real business logic — not
                bolted-on chatbots that frustrate your users. We engineer intelligence into your
                workflow, not marketing fluff into your pitch deck.
              </p>
              <p>
                Whether you need a high-converting ecommerce store, an autonomous lead system, or a
                full digital rebuild, we ship production-grade systems that you own completely.
              </p>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800/50"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 mb-4">
                  <value.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-blue-950/30 to-purple-950/30 p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-3">How we reduce delivery risk</p>
            <h2 className="text-2xl font-bold text-white mb-4">Understand the problem before prescribing the build.</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Every engagement starts with the existing system, business constraints, integrations, and measurable outcome. We preserve working routes, data, content, and operations wherever an incremental change is safer than replacement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/process" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white">Explore our process <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
              <Link href="/work" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">View production work <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
