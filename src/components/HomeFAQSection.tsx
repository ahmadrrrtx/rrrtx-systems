import Image from "next/image";
import { HelpCircle } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { faqs } from "@/lib/faq-content";

/**
 * Homepage FAQ — the seven production Q&As (shared with /faq via
 * faq-content.ts) alongside the generated brand visual. Answers render
 * from <details>/<summary> so the content is crawlable without JS.
 */
export function HomeFAQSection() {
  return (
    <SectionWrapper className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/3 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/[0.03] blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div>
            <header className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Common questions</p>
              <h2 className="mb-3 text-3xl font-bold tracking-[-0.025em] text-white lg:text-4xl">Answers before you commit.</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-300 lg:text-base">
                Clear expectations reduce project risk. These answers cover how RRRTX Systems scopes, builds, and hands over production systems.
              </p>
            </header>

            <div className="space-y-3.5">
              {faqs.map((faq, i) => (
                <details
                  key={faq.question}
                  className="faq-item group rounded-xl border border-slate-800/60 bg-slate-950/40 p-5 transition-colors duration-300 hover:border-cyan-500/25"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-base font-semibold text-white">
                    <HelpCircle className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                    {faq.question}
                    <span className="ml-auto text-slate-400 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 pl-7 text-sm leading-7 text-slate-300">{faq.answer}</p>
                </details>
              ))}
            </div>

          </div>

          {/* Generated brand visual */}
          <aside className="relative hidden lg:block">
            <div className="premium-surface sticky top-28 overflow-hidden rounded-3xl border-slate-800/70">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" aria-hidden="true" />
              <Image
                src="/assets/faq-visual.webp"
                alt=""
                width={640}
                height={1376}
                sizes="320px"
                className="h-auto w-full"
              />
            </div>
          </aside>
        </div>
      </div>
    </SectionWrapper>
  );
}
