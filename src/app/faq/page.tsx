import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/seo";
import { faqs } from "@/lib/faq-content";

export const metadata: Metadata = createMetadata({
  title: "Frequently Asked Questions",
  description: "Answers about RRRTX Systems services, process, ownership, pricing, technology, support, and project fit.",
  path: "/faq",
});


export default function FaqPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return (
    <main className="min-h-screen bg-[#020617]">
      <JsonLd id="schema-faq-page" data={schema} />
      <Navbar />
      <section className="pt-32 pb-24"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
        <div>
        <header className="mb-14"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Common questions</p><h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Answers before you commit.</h1><p className="text-lg text-slate-300">Clear expectations reduce project risk. These answers cover how RRRTX Systems scopes, builds, and hands over production systems.</p></header>
        <div className="space-y-4">
          {faqs.map((faq) => <details key={faq.question} className="group rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"><summary className="cursor-pointer list-none flex items-center gap-3 text-base font-semibold text-white"><HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />{faq.question}<span className="ml-auto text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">+</span></summary><p className="mt-4 pl-7 text-sm leading-7 text-slate-300">{faq.answer}</p></details>)}
        </div>
        <div className="mt-12 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-7 text-center"><h2 className="text-xl font-bold text-white mb-2">Still evaluating the right next step?</h2><p className="text-sm text-slate-400 mb-5">Share the constraint and desired outcome. We will help determine whether an audit, discovery phase, or build is appropriate.</p><Link href="/contact" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white">Book a Strategy Call <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link></div>
        </div>
        <aside className="hidden lg:block sticky top-28" aria-hidden="true">
          <div className="premium-surface relative overflow-hidden rounded-3xl border-slate-800/70">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <Image src="/assets/faq-visual.webp" alt="" width={640} height={1376} sizes="320px" className="h-auto w-full" priority={false} />
          </div>
        </aside>
        </div>
      </div></section>
      <Footer />
    </main>
  );
}
