"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, BriefcaseBusiness, Workflow, BadgeDollarSign } from "lucide-react";
import type { ServiceDetail } from "@/lib/service-data";

export function ServicePageClient({ service }: { service: ServiceDetail }) {
  return (
    <main className="relative min-h-screen bg-[#020617]">
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
            <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-5">
              <Link href="/services" className="hover:text-cyan-400">Services</Link>
              <span aria-hidden="true" className="mx-2">/</span>
              <span aria-current="page">{service.title}</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Service</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">{service.title}</h1>
            <p className="text-slate-300 max-w-3xl text-lg leading-relaxed">{service.headline}</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start">
            <div>
              <p className="text-slate-300 leading-relaxed mb-8">{service.description}</p>
              <h2 className="text-lg font-bold text-white mb-4">What the engagement can include</h2>
              <ul className="space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-800/50">
              <Image src={service.image} alt={`${service.title} system visualization`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
            </div>
          </div>

          <section aria-labelledby="next-step-heading" className="grid md:grid-cols-3 gap-4 mb-16">
            {[
              { icon: BriefcaseBusiness, title: "See production work", text: "Review the systems, constraints, and outcomes behind our portfolio.", href: "/work", label: "View our work" },
              { icon: Workflow, title: "Understand the process", text: "See how discovery, delivery, deployment, and optimization work.", href: "/process", label: "Explore our process" },
              { icon: BadgeDollarSign, title: "Plan the engagement", text: "Start with scope, priorities, and the right engagement model.", href: "/contact", label: "Book a strategy call" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800/50 bg-slate-950/40 p-5">
                <item.icon className="w-5 h-5 text-cyan-400 mb-3" aria-hidden="true" />
                <h2 id={item.title === "See production work" ? "next-step-heading" : undefined} className="text-base font-bold text-white mb-2">{item.title}</h2>
                <p className="text-sm text-slate-400 mb-4">{item.text}</p>
                <Link href={item.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                  {item.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </section>

          <div className="text-center rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-blue-950/30 to-purple-950/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-3">Build the right system for your business.</h2>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">Tell us what is slowing growth or creating operational friction. We will map the safest next step before recommending a build.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">
              Book a Strategy Call <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
