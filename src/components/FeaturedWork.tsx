"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import Link from "next/link";
import { ArrowRight, ExternalLink, Code, TrendingUp } from "lucide-react";

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

export function FeaturedWork({ items }: { items?: WorkItem[] }) {
  const projects = items && items.length > 0 ? items : defaultProjects;

  return (
    <SectionWrapper id="work" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Featured Work
            </p>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
              Systems That Ship.
            </h2>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            View all work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric grid: first card large, remaining smaller */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hero card — first project gets full-width left column */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-500 lg:row-span-2"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto lg:h-[55%] overflow-hidden">
                <img
                  src={projects[0].image}
                  alt={projects[0].title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {projects[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-black/50 backdrop-blur-sm text-slate-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                    {projects[0].industry}
                  </span>
                  <span className="text-[10px] text-slate-500">{projects[0].client}</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {projects[0].title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {projects[0].description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    {projects[0].metrics}
                  </div>
                  <Link
                    href={projects[0].link}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {projects[0].link.includes("github") ? (
                      <Code className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    {projects[0].link.includes("github") ? "View Code" : "Live Site"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Remaining cards stacked on the right */}
          <div className="flex flex-col gap-6">
            {projects.slice(1).map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + (i + 1) * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60 transition-all duration-500 flex flex-col sm:flex-row"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#020617]/80 hidden sm:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent sm:hidden" />
                </div>

                <div className="p-5 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                      {project.industry}
                    </span>
                    <span className="text-[10px] text-slate-500">{project.client}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-slate-900/80 text-slate-500 border border-slate-800/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                      <span className="truncate">{project.metrics}</span>
                    </div>
                    <Link
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                    >
                      {project.link.includes("github") ? (
                        <Code className="w-3.5 h-3.5" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
