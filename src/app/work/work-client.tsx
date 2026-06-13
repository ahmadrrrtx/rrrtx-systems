"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Code } from "lucide-react";

type WorkItem = {
  client: string;
  industry: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  metrics: string;
};

const defaultProjects: WorkItem[] = [
  {
    client: "Janjua Sports",
    industry: "Ecommerce / DTC",
    title: "Full-Stack Ecommerce Platform",
    description:
      "Custom Next.js storefront with category architecture, product grid, cart logic, WhatsApp order integration, and COD checkout — built from scratch for a sports brand in Sialkot.",
    image: "/assets/abstract-commerce-grid.png",
    link: "https://janjua-sports.vercel.app/",
    tags: ["Next.js", "Custom Cart", "WhatsApp API", "COD"],
    metrics: "15K+ orders processed, sub-2s load times",
  },
  {
    client: "RRRTX Internal",
    industry: "AI / Automation",
    title: "Gemma 4 RSS Intelligence Agent",
    description:
      "Autonomous developer-news agent powered by Gemma 4 E4B. Monitors 25+ RSS feeds, classifies signal vs. noise, and posts clean digests to Slack — running on a $7/month VPS with zero API costs.",
    image: "/assets/ai-agent-network.png",
    link: "https://github.com/ahmadrrrtx/Gemma-4-RSS-Intelligence-Monitor",
    tags: ["Python", "Gemma 4", "Slack API", "Local LLM"],
    metrics: "$0 AI spend, 6-hour monitoring cycles",
  },
  {
    client: "Client Project",
    industry: "Automation / CRM",
    title: "Make.com → Custom Automation Migration",
    description:
      "Replaced fragile Make.com spaghetti workflows with a robust custom Python automation pipeline. Lead scoring, CRM sync, and follow-up sequences now run without third-party failure points.",
    image: "/assets/hero-core-visual.png",
    link: "#",
    tags: ["Make.com", "Python", "CRM Integration", "Lead Scoring"],
    metrics: "90% reduction in workflow failures",
  },
];

export function WorkPageClient({ items }: { items?: WorkItem[] }) {
  const projects = items && items.length > 0 ? items : defaultProjects;
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
              Portfolio
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Work That{" "}
              <span className="text-gradient">Ships.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg">
              Real projects. Real code. Real results. Not mockups or concepts — systems
              that are running in production right now.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-black/40 backdrop-blur-sm text-slate-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                      {project.industry}
                    </span>
                    <span className="text-[10px] text-slate-500">{project.client}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">
                      {project.metrics}
                    </span>
                    <Link
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {project.link.includes("github") ? (
                        <Code className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                      {project.link.includes("github") ? "View Code" : "Live Site"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
