import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Frequently Asked Questions",
  description: "Answers about RRRTX Systems services, process, ownership, pricing, technology, support, and project fit.",
  path: "/faq",
});

const faqs = [
  { question: "Does RRRTX Systems use templates?", answer: "RRRTX Systems designs around the business requirements and can build custom storefronts, dashboards, integrations, and automations. Existing systems are preserved when an incremental improvement is safer than replacement." },
  { question: "Who owns the delivered system?", answer: "Ownership, source access, infrastructure, and handover are defined in the project agreement. The standard approach is to avoid unnecessary lock-in and leave clients with maintainable code and documentation." },
  { question: "How does a project start?", answer: "Projects begin by clarifying the business outcome, current constraints, integrations, risks, and success measures. RRRTX Systems then recommends the smallest responsible next step, which may be an audit, discovery engagement, or scoped implementation." },
  { question: "How long does a project take?", answer: "Timing depends on validated scope and dependencies. Discovery is commonly completed before a build is scheduled, and implementation is delivered in reviewable milestones rather than as one unverified handoff." },
  { question: "Which technologies does RRRTX Systems use?", answer: "The current core stack includes Next.js, React, TypeScript, Turso, Drizzle, Python, Vercel, and Cloudflare. Technology is selected for the system's requirements rather than included only because it is fashionable." },
  { question: "Can RRRTX Systems improve an existing website?", answer: "Yes. Rebuild and conversion engagements can preserve existing content, routes, analytics, forms, and integrations while improving the weakest technical or user-experience layers incrementally." },
  { question: "Does RRRTX Systems provide post-launch support?", answer: "Project and retainer engagements can include monitoring, optimization, feature work, and support. The exact response expectations and included work are documented in the engagement scope." },
];

export default function FaqPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-faq-page" data={schema} />
      <Navbar />
      <section className="pt-32 pb-24"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-14"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Common questions</p><h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Answers before you commit.</h1><p className="text-lg text-slate-300">Clear expectations reduce project risk. These answers cover how RRRTX Systems scopes, builds, and hands over production systems.</p></header>
        <div className="space-y-4">
          {faqs.map((faq) => <details key={faq.question} className="group rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"><summary className="cursor-pointer list-none flex items-center gap-3 text-base font-semibold text-white"><HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />{faq.question}<span className="ml-auto text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">+</span></summary><p className="mt-4 pl-7 text-sm leading-7 text-slate-300">{faq.answer}</p></details>)}
        </div>
        <div className="mt-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-7 text-center"><h2 className="text-xl font-bold text-white mb-2">Still evaluating the right next step?</h2><p className="text-sm text-slate-400 mb-5">Share the constraint and desired outcome. We will help determine whether an audit, discovery phase, or build is appropriate.</p><Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">Book a Strategy Call <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div>
      </div></section>
      <Footer />
    </main>
  );
}
