"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Copy, Globe2, Mail, MessageSquare } from "lucide-react";

const RESOURCES = [
  { title: "Services overview", desc: "Exactly what RRRTX builds and how each service is positioned.", href: "/services", icon: Globe2 },
  { title: "Case studies", desc: "Real projects to reference when explaining RRRTX work.", href: "/work", icon: BookOpen },
  { title: "Engagement process", desc: "How RRRTX scopes and delivers — useful for setting expectations.", href: "/process", icon: ArrowRight },
  { title: "Partner FAQ", desc: "Answers to the most common partner questions.", href: "/partners", icon: MessageSquare },
];

const TEMPLATES = [
  {
    channel: "WhatsApp",
    icon: MessageSquare,
    text: "Hi [Name], I wanted to introduce you to RRRTX Systems — they build custom ecommerce sites and AI automation for businesses like yours. They engineered a few projects I've been impressed by. Want me to connect you for a quick call?",
  },
  {
    channel: "Email",
    icon: Mail,
    text: "Subject: An introduction worth a look\n\nHi [Name],\n\nI came across RRRTX Systems recently — they build custom ecommerce platforms, AI automations, and lead-generation systems from scratch. Given what you're working on, their team might be a useful conversation. I'm happy to make the introduction if you'd like.\n\nBest,\n[Your name]",
  },
  {
    channel: "LinkedIn",
    icon: Globe2,
    text: "Hi [Name] — quick one. I know a team (RRRTX Systems) that builds custom ecommerce and AI automation for growing businesses. They're engineering-first and own the full stack. Worth a 15-minute intro if you're exploring this?",
  },
];

export default function PartnerResources() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Resources</h1>
        <p className="text-sm text-slate-400">Material to help you introduce RRRTX confidently and accurately.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {RESOURCES.map((r) => (
          <Link key={r.title} href={r.href} className="group rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <r.icon className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{r.title}</h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{r.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
        <div className="p-5 border-b border-slate-800/50">
          <h2 className="text-sm font-semibold text-white">Introduction templates</h2>
          <p className="text-xs text-slate-500 mt-1">Personalize these — authenticity converts better than scripts.</p>
        </div>
        <div className="divide-y divide-slate-800/50">
          {TEMPLATES.map((t) => (
            <div key={t.channel} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <t.icon className="w-4 h-4 text-purple-400" aria-hidden="true" /> {t.channel}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(t.text)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" /> Copy
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Remember: partners introduce and refer. You do not quote prices, sign agreements, or deliver work on RRRTX&apos;s behalf.
      </p>
    </div>
  );
}
