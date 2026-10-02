"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CornerDownRight, RotateCcw, Sparkles } from "lucide-react";

/**
 * AI Opportunity Mapper — free interactive tool.
 * Pick a business function and a bottleneck; get the automation pattern
 * that usually pays first, the components involved, and a first step.
 * Static mapping data in code; no network calls.
 */

const FUNCTIONS = [
  { id: "sales", label: "Sales & Leads" },
  { id: "marketing", label: "Marketing & Content" },
  { id: "ops", label: "Operations & Data" },
  { id: "support", label: "Customer Support" },
  { id: "finance", label: "Finance & Admin" },
] as const;

const BOTTLENECKS = [
  { id: "entry", label: "Manual data entry & re-typing" },
  { id: "followup", label: "Slow lead / request follow-up" },
  { id: "reporting", label: "Repetitive reporting & summaries" },
  { id: "content", label: "Content backlog" },
  { id: "tickets", label: "Repetitive questions & tickets" },
  { id: "orders", label: "Order & invoice processing" },
] as const;

interface Pattern {
  name: string;
  what: string;
  components: string[];
  first: string;
}

const PATTERNS: Record<string, Pattern> = {
  entry: {
    name: "Capture → Classify → Sync pipeline",
    what: "A pipeline that ingests what arrives (forms, emails, files), classifies it with an AI step, and writes clean records into your system of record — so nobody re-types anything.",
    components: ["Ingestion endpoint or inbox watcher", "AI classification/validation step", "Write-back to your database", "Failure alerts + retry"],
    first: "Pick the single document type that gets re-typed most, and automate just that path end to end.",
  },
  followup: {
    name: "Instant-response lead agent",
    what: "Every new lead gets an immediate, context-aware reply and a routed notification, while qualification runs in the background — minutes matter and humans step in where judgment is needed.",
    components: ["Lead source integration", "Drafting agent with your tone + rules", "Routing rules (owner, channel)", "Response-time tracking"],
    first: "Instrument current response times for one week — the baseline makes the ROI obvious.",
  },
  reporting: {
    name: "Scheduled summarization agent",
    what: "An agent pulls the numbers on a schedule, writes the summary you actually read, and posts it where the team lives — with the underlying queries documented and versioned.",
    components: ["Data source connections", "Prompted summary template", "Scheduled run + delivery", "Archive for audit"],
    first: "Write down the report you rebuild most often and what fields it truly needs.",
  },
  content: {
    name: "Editorial pipeline with human sign-off",
    what: "Briefs, drafts, and variants are produced in your voice from structured inputs, then queued for human approval — nothing publishes itself, but the blank page disappears.",
    components: ["Brand voice guide as data", "Brief → draft → review stages", "Approval queue", "Publishing integration"],
    first: "Templatize your three most repeated content formats and generate briefs for them first.",
  },
  tickets: {
    name: "Support assistant grounded in your data",
    what: "An assistant answers the repetitive questions from your own docs, policies, and order data, and escalates to a human with full context when the question is real.",
    components: ["Knowledge base ingestion", "Grounded answering with citations", "Escalation path + handoff notes", "Deflection analytics"],
    first: "Export your last 100 tickets and count how many are truly repetitive — that set is the target.",
  },
  orders: {
    name: "Document → records reconciliation flow",
    what: "Orders, invoices, and confirmations are read, matched against your records, and reconciled automatically — mismatches land in a review queue instead of a spreadsheet.",
    components: ["Document parsing", "Matching rules + AI assist for edge cases", "Review queue", "Accounting export"],
    first: "Take one week of real documents and measure how long manual matching actually takes.",
  },
};

const FUNCTION_CONTEXT: Record<string, string> = {
  sales: "In sales, this pattern usually pays back first in response time and pipeline hygiene.",
  marketing: "In marketing, this pattern keeps output consistent while the team keeps editorial control.",
  ops: "In operations, this pattern removes the re-typing layer between systems and people.",
  support: "In support, this pattern deflects the repetitive load and protects your team's attention.",
  finance: "In finance, this pattern tightens reconciliation and gives you a clean audit trail.",
};

export default function AIOpportunityMapperClient() {
  const [fn, setFn] = useState<string | null>(null);
  const [bn, setBn] = useState<string | null>(null);

  const pattern = bn ? PATTERNS[bn] : null;
  const done = fn && bn;

  const reset = () => { setFn(null); setBn(null); };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] pb-28 pt-32">
      <div className="soft-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/[0.05] blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <p className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Free tool · no signup
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-[-0.025em] text-white lg:text-5xl">AI Opportunity Mapper</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 lg:text-base">
            Pick the function and the bottleneck. You get the automation pattern that usually pays first, the components involved, and a sensible first step.
          </p>
        </header>

        {/* Step 1 */}
        <section className="mb-4 rounded-2xl border border-slate-800/60 bg-slate-950/50 p-5 sm:p-6" aria-labelledby="mapper-fn">
          <h2 id="mapper-fn" className="mb-4 flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-500/40 font-mono text-[10px] text-cyan-300">1</span>
            Which function is it?
          </h2>
          <div className="flex flex-wrap gap-2">
            {FUNCTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={fn === f.id}
                onClick={() => setFn(f.id)}
                className={`rounded-xl border px-4 py-2.5 text-[13px] transition-all duration-200 ${
                  fn === f.id
                    ? "border-cyan-400/50 bg-cyan-500/[0.08] text-white shadow-[0_0_24px_-10px_rgba(34,211,238,.5)]"
                    : "border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Step 2 */}
        <section className={`mb-4 rounded-2xl border border-slate-800/60 bg-slate-950/50 p-5 transition-opacity sm:p-6 ${fn ? "" : "pointer-events-none opacity-40"}`} aria-labelledby="mapper-bn">
          <h2 id="mapper-bn" className="mb-4 flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-violet-400/40 font-mono text-[10px] text-violet-300">2</span>
            What&rsquo;s the bottleneck?
          </h2>
          <div className="flex flex-wrap gap-2">
            {BOTTLENECKS.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={bn === b.id}
                onClick={() => setBn(b.id)}
                className={`rounded-xl border px-4 py-2.5 text-[13px] transition-all duration-200 ${
                  bn === b.id
                    ? "border-violet-400/50 bg-violet-500/[0.08] text-white shadow-[0_0_24px_-10px_rgba(167,139,250,.5)]"
                    : "border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </section>

        {/* Result */}
        {done && pattern ? (
          <section className="rounded-2xl border border-violet-500/25 bg-slate-950/70 p-6 shadow-[0_0_50px_-20px_rgba(139,92,246,.4)] sm:p-8" aria-live="polite">
            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-violet-300">Mapped opportunity</p>
            <h2 className="mb-3 text-xl font-bold text-white lg:text-2xl">{pattern.name}</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">{pattern.what}</p>
            <p className="mb-2 text-[13px] font-semibold text-slate-200">
              {FUNCTION_CONTEXT[fn as keyof typeof FUNCTION_CONTEXT]}
            </p>
            <div className="mb-5 grid gap-2 sm:grid-cols-2">
              {pattern.components.map((c) => (
                <div key={c} className="flex items-start gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 text-[13px] text-slate-300">
                  <CornerDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
                  {c}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.05] p-4">
              <p className="text-[13px] leading-relaxed text-slate-200">
                <b className="font-semibold text-cyan-300">First step: </b>{pattern.first}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                prefetch={false}
                href="/contact"
                className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Scope this system on a strategy call <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-cyan-300">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Map another bottleneck
              </button>
            </div>
          </section>
        ) : (
          <p className="text-center text-xs text-slate-500">Both picks needed — the map updates instantly, nothing is sent anywhere.</p>
        )}
      </div>
    </main>
  );
}
