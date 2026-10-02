"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Gauge, RotateCcw } from "lucide-react";

/**
 * Automation Readiness Check — free self-assessment tool.
 * Entirely client-side: eight questions, an honest score, and guidance.
 * No network calls, no data leaves the browser.
 */

const QUESTIONS = [
  {
    q: "Are your core workflows documented?",
    options: [
      { label: "Not documented — they live in people's heads", score: 0 },
      { label: "Partially — the important ones are written down", score: 1 },
      { label: "Yes, most repeatable work has a written process", score: 2 },
    ],
  },
  {
    q: "How much time goes into repetitive data entry and copy-paste work?",
    options: [
      { label: "Hours every day across the team", score: 0 },
      { label: "A few hours per week", score: 1 },
      { label: "Minimal — most of it is already handled", score: 2 },
    ],
  },
  {
    q: "How fast do new leads get a first response?",
    options: [
      { label: "Hours — or whenever someone sees the message", score: 0 },
      { label: "Within the same working day", score: 1 },
      { label: "Automatically, within minutes", score: 2 },
    ],
  },
  {
    q: "Where does your operational data live?",
    options: [
      { label: "Scattered across inboxes, chats, and spreadsheets", score: 0 },
      { label: "Mostly one system, with known gaps", score: 1 },
      { label: "One source of truth the team actually updates", score: 2 },
    ],
  },
  {
    q: "How do orders, inquiries, or handoffs move between people?",
    options: [
      { label: "Manually — someone forwards or re-enters them", score: 0 },
      { label: "Partly automated, with manual checkpoints", score: 1 },
      { label: "System-driven with notifications and status", score: 2 },
    ],
  },
  {
    q: "Do you know your conversion rate at each step of your funnel?",
    options: [
      { label: "No — we see outcomes, not steps", score: 0 },
      { label: "A rough overall number exists", score: 1 },
      { label: "Tracked per step, reviewed regularly", score: 2 },
    ],
  },
  {
    q: "Have you tried automation before?",
    options: [
      { label: "No, it never got started", score: 0 },
      { label: "Yes — tools like Make or Zapier for some flows", score: 1 },
      { label: "Yes — custom scripts or systems in production", score: 2 },
    ],
  },
  {
    q: "What happens today when a workflow silently fails?",
    options: [
      { label: "We notice when a customer complains", score: 0 },
      { label: "Someone usually catches it within a day", score: 1 },
      { label: "Monitoring and alerts surface it immediately", score: 2 },
    ],
  },
] as const;

const MAX_SCORE = QUESTIONS.length * 2;

const VERDICTS = [
  {
    max: 40,
    tone: "#f87171",
    label: "Foundation stage",
    body: "The basics will pay first: document the repeatable work, centralize the data, and pick the one manual flow that costs the most hours. A focused audit turns this into a short, ordered list.",
  },
  {
    max: 75,
    tone: "#fbbf24",
    label: "Ready for targeted automation",
    body: "The fundamentals are there. Highest-return next steps are usually lead response, data handoffs, and reporting — bounded systems with monitoring, not big-bang rewrites.",
  },
  {
    max: 100,
    tone: "#34d399",
    label: "Prime for systems engineering",
    body: "You operate like a systems team already. The remaining upside is orchestration: connecting the tools you run, automating the judgment steps, and instrumenting what ships.",
  },
];

export default function AutomationReadinessClient() {
  const [answers, setAnswers] = useState<Array<number | null>>(() => QUESTIONS.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const answered = answers.filter((a) => a !== null).length;
  const score = useMemo(() => answers.reduce<number>((sum, a) => sum + (a ?? 0), 0), [answers]);
  const pct = Math.round((score / MAX_SCORE) * 100);
  const verdict = VERDICTS.find((v) => pct <= v.max) ?? VERDICTS[VERDICTS.length - 1];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] pb-28 pt-32">
      <div className="soft-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[0.04] blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Free tool · no signup</p>
          <h1 className="mb-4 text-3xl font-bold tracking-[-0.025em] text-white lg:text-5xl">Automation Readiness Check</h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 lg:text-base">
            Eight questions about how your work actually runs. You get an honest readiness score and a sensible next step — answers stay in your browser.
          </p>
        </header>

        <ol className="space-y-4">
          {QUESTIONS.map((question, qi) => (
            <li
              key={question.q}
              className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-5 sm:p-6"
              style={{ "--i": qi } as React.CSSProperties}
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 font-mono text-[11px] tracking-[0.12em] text-slate-500">{String(qi + 1).padStart(2, "0")}</span>
                <h2 className="text-base font-semibold text-white">{question.q}</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {question.options.map((option, oi) => {
                  const selected = answers[qi] === oi;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
                        setSubmitted(false);
                      }}
                      aria-pressed={selected}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-left text-[13px] leading-snug transition-all duration-200 ${
                        selected
                          ? "border-cyan-400/50 bg-cyan-500/[0.08] text-white shadow-[0_0_24px_-10px_rgba(34,211,238,.5)]"
                          : "border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-slate-600 hover:text-white"
                      }`}
                    >
                      {selected ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden="true" />
                      )}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        {/* Result */}
        <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-6 sm:p-8">
          {answered < QUESTIONS.length ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-slate-300">
                {answered} of {QUESTIONS.length} answered — answer the rest to see your score.
              </p>
              <div className="mx-auto h-2 max-w-sm overflow-hidden rounded-full bg-slate-800/70" role="presentation">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : submitted ? (
            <div className="text-center">
              <Gauge className="mx-auto mb-4 h-8 w-8" style={{ color: verdict.tone }} aria-hidden="true" />
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Your readiness score</p>
              <p className="my-2 text-5xl font-extrabold text-white">
                {pct}
                <span className="text-xl text-slate-500">/100</span>
              </p>
              <p className="mb-3 text-lg font-bold" style={{ color: verdict.tone }}>{verdict.label}</p>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">{verdict.body}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  prefetch={false}
                  href="/contact"
                  className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Discuss your result on a strategy call <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => { setAnswers(QUESTIONS.map(() => null)); setSubmitted(false); }}
                  className="inline-flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-cyan-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start over
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
              >
                See my readiness score <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-3 text-xs text-slate-500">Runs entirely in your browser — nothing is stored or sent.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
