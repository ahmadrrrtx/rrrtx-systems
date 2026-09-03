import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, Ban, Briefcase, Building2, Calculator, CheckCircle2, Crown, FileSignature, FileX, Gem, Globe2, Handshake, LineChart, Medal, MessageSquare, Rocket, RotateCcw, Scale, ScanSearch, ShieldCheck, Sparkles, Trophy, UserPlus, Users, Wallet } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Partner Network — Refer, Build, Earn, Grow",
  description:
    "Join the RRRTX Partner Network. Introduce prospective clients for custom ecommerce, AI automation, and lead-generation systems and earn commission on qualifying paid projects. Apply, get approved, and track every referral in a dedicated partner dashboard.",
  path: "/partners",
});

const RANKS = [
  { key: "starter", name: "Starter", projects: "—", revenue: "—", note: "Every newly approved partner." },
  { key: "bronze", name: "Bronze", projects: "2 projects", revenue: "$5,000", note: "First qualified wins." },
  { key: "silver", name: "Silver", projects: "5 projects", revenue: "$15,000", note: "Consistent referrals." },
  { key: "gold", name: "Gold", projects: "10 projects", revenue: "$35,000", note: "Proven referral record." },
  { key: "platinum", name: "Platinum", projects: "20 projects", revenue: "$75,000", note: "Top-tier contributors." },
  { key: "elite", name: "Elite", projects: "By invitation", revenue: "By invitation", note: "Strategic recognition." },
];

const RANK_BADGES: Record<string, { icon: typeof Medal; ring: string; from: string; to: string; text: string; glow: string }> = {
  starter: { icon: Medal, ring: "border-slate-500/60", from: "from-slate-600", to: "to-slate-800", text: "text-slate-300", glow: "bg-slate-500/20" },
  bronze: { icon: Award, ring: "border-orange-500/60", from: "from-orange-500", to: "to-amber-700", text: "text-orange-300", glow: "bg-orange-500/20" },
  silver: { icon: ShieldCheck, ring: "border-slate-300/60", from: "from-slate-300", to: "to-slate-500", text: "text-slate-200", glow: "bg-slate-300/20" },
  gold: { icon: Trophy, ring: "border-yellow-500/60", from: "from-yellow-400", to: "to-amber-600", text: "text-yellow-300", glow: "bg-yellow-500/20" },
  platinum: { icon: Crown, ring: "border-cyan-400/60", from: "from-cyan-400", to: "to-sky-600", text: "text-cyan-300", glow: "bg-cyan-500/20" },
  elite: { icon: Gem, ring: "border-pink-500/60", from: "from-pink-500", to: "to-fuchsia-700", text: "text-pink-300", glow: "bg-pink-500/20" },
};

const SAMPLE_DOCS = [
  { src: "/assets/templates/samples/certificate-sample-1.png", alt: "Sample RRRTX Certificate of Partnership", label: "Certificate of Partnership" },
  { src: "/assets/templates/samples/joining-letter-sample-1.png", alt: "Sample RRRTX Partner Appointment Letter", label: "Partner Appointment Letter" },
];

const DOCUMENT_INFO = [
  { icon: FileSignature, title: "Partner Appointment Letter", desc: "An official letter confirming your acceptance, Partner ID, rank, commission rate, and effective date." },
  { icon: ShieldCheck, title: "Certificate of Partnership", desc: "A certificate with a QR code anyone can scan to verify authenticity on rrrtx-systems.com." },
  { icon: BadgeCheck, title: "Achievement Certificates", desc: "Every rank advancement from Bronze to Elite issues a new certificate for the achievement." },
];

const REFER_TYPES = [
  { title: "Custom Ecommerce", desc: "Built-from-scratch stores with real cart logic and conversion architecture.", icon: Briefcase },
  { title: "AI Automations & Agents", desc: "Custom agents that monitor, classify, and act on real business data.", icon: Sparkles },
  { title: "Lead Generation Systems", desc: "Capture, qualify, and route leads automatically.", icon: Users },
  { title: "Website Rebuilds", desc: "Audit and rebuild underperforming sites into conversion systems.", icon: Rocket },
  { title: "Chatbots & AI Assistants", desc: "Context-aware assistants trained on business data.", icon: MessageSquare },
  { title: "SEO & AEO", desc: "Technical SEO and answer-engine optimization built into the architecture.", icon: Globe2 },
];

const STEPS = [
  { title: "Apply", desc: "Submit a short application. We review it, not a bot." },
  { title: "Approve", desc: "Approved partners receive a Partner ID and account setup code." },
  { title: "Sign", desc: "Read and electronically accept the Partner Agreement." },
  { title: "Onboard", desc: "Receive your Joining Letter and Partnership Certificate." },
  { title: "Refer", desc: "Submit referrals and track them from introduction to outcome." },
  { title: "Earn", desc: "Commission is calculated on client payments received." },
];

const FAQS = [
  { q: "What is the RRRTX Partner Network?", a: "The RRRTX Partner Network lets approved partners introduce prospective clients to RRRTX Systems and earn commission on qualifying projects that are signed and paid, according to the Partner Agreement." },
  { q: "Who can become an RRRTX Partner?", a: "Professionals who know business owners that need custom ecommerce, AI automation, lead-generation systems, rebuilds, chatbots, or SEO/AEO work — agencies, consultants, freelancers, and operators. Applications are reviewed individually." },
  { q: "How does the referral program work?", a: "You apply, get approved, accept the Partner Agreement, and submit referrals through your partner dashboard. RRRTX qualifies and pursues each referral; you track status from submission to outcome." },
  { q: "How much commission does an RRRTX Partner earn?", a: "The default commission rate is 10% of client payments actually received for an attributable qualifying project, net of refunds and reversals, as defined in the Partner Agreement. Rates are shown in your dashboard." },
  { q: "When is commission paid?", a: "Commission becomes payable after RRRTX receives the applicable client payment. Payment timing and any reversal windows are set out in the Partner Agreement." },
  { q: "What projects can partners refer?", a: "Custom ecommerce builds, AI automations and agents, lead-generation systems, website rebuilds, chatbots and AI assistants, and SEO/AEO engagements." },
  { q: "How are referrals attributed?", a: "Manual submission through the official partner dashboard is the authoritative attribution method. The partner who first submits a qualified prospect is attributed the referral; duplicate and existing leads are resolved in good faith under the Agreement." },
  { q: "How do partners track referrals?", a: "Each referral gets a unique ID and a visible status — submitted, under review, contacted, discovery, proposal, negotiation, won, or lost — updated by RRRTX." },
  { q: "How do partners progress through ranks?", a: "Ranks are Starter, Bronze, Silver, Gold, Platinum, and Elite, based on successful projects or attributed revenue. Progress is shown in the dashboard, and each new tier issues an achievement certificate." },
  { q: "Does RRRTX provide a partner certificate?", a: "Yes. On onboarding you receive a Partnership Certificate with a QR verification link, and each rank advancement issues an achievement certificate." },
  { q: "How does partner onboarding work?", a: "After approval you set up your account with a one-time code, read and electronically accept the Partner Agreement, and receive your Joining Letter and Partnership Certificate before the dashboard unlocks." },
  { q: "How is the Partner Agreement accepted electronically?", a: "You review the agreement while signed in, confirm you have read and understood it, and type your legal name as your electronic signature. The version, timestamp, and document integrity metadata are recorded." },
];

export default function PartnersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="relative min-h-screen bg-[#020617]">
      <JsonLd id="schema-partner-faq" data={faqSchema} />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section data-reveal className="relative overflow-hidden pt-36 pb-20">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/assets/partner-hero.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/85 via-[#020617]/60 to-[#020617]" />
        </div>
        <div className="soft-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="absolute left-1/2 top-[-6rem] h-72 w-[720px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[110px]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 mb-6">
            <Handshake className="w-3.5 h-3.5" aria-hidden="true" /> RRRTX Partner Network
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Refer. Build. <span className="text-gradient">Earn. Grow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            You bring the relationship. RRRTX builds the technology. Introduce prospective clients and earn commission on qualifying, paid projects — with a real dashboard tracking every referral from introduction to payment.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/partners/apply" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white">
              Become a Partner <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/partner/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/40 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-colors">
              Partner Login
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">Commission is earned on qualifying paid projects, per the Partner Agreement. No recruitment tiers, no downlines.</p>
        </div>
      </section>

      {/* ── Why partner ──────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Why partner with RRRTX</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">A real product to stand behind.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, title: "Technology people actually need", desc: "Custom ecommerce, AI automation, and lead systems — not resold templates or retainer fluff." },
              { icon: LineChart, title: "Commission on paid work", desc: "10% default commission on received client payments, tracked transparently in your dashboard." },
              { icon: ShieldCheck, title: "Clear attribution", desc: "A unique referral ID and status for every introduction. No black-box tracking." },
              { icon: FileSignature, title: "Onboarding that means something", desc: "A signed agreement, an official Joining Letter, and a verifiable Partnership Certificate." },
              { icon: Globe2, title: "Global, async-first", desc: "Working with clients across time zones is already how RRRTX operates." },
              { icon: Users, title: "No delivery burden", desc: "You make the introduction. RRRTX qualifies, scopes, builds, and delivers." },
            ].map((item) => (
              <div key={item.title} className="premium-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">How it works</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">From application to first commission.</h2>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="premium-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Onboarding documents (sample carousel) ───────── */}
      <section data-reveal className="py-20 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Onboarding documents</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Paperwork you can be proud of.</h2>
            <p className="mt-4 text-slate-300">
              Every approved partner receives official documents generated from RRRTX&#39;s own templates — a Partner Appointment Letter and a Certificate of Partnership with a QR code that proves authenticity.
            </p>
          </div>
        </div>

        <div className="relative" aria-hidden="true">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-[#020617] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-[#020617] to-transparent" />
          <div className="rrrtx-doc-marquee flex w-max items-start gap-5 py-2">
            {Array.from({ length: 12 }).map((_, i) => {
              const doc = SAMPLE_DOCS[i % SAMPLE_DOCS.length];
              return (
                <figure key={i} className="w-[150px] sm:w-[190px] shrink-0">
                  <div className="rounded-xl border border-slate-800/70 bg-slate-950/60 p-2 shadow-[0_0_30px_-12px_rgba(56,189,248,0.25)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={doc.src} alt={doc.alt} className="w-full h-64 object-contain rounded-lg" loading="lazy" />
                  </div>
                  <figcaption className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{doc.label}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid md:grid-cols-3 gap-5">
            {DOCUMENT_INFO.map((item) => (
              <div key={item.title} className="premium-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <ScanSearch className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Verify any certificate</h3>
                <p className="text-sm text-slate-400">Anyone can confirm a document is genuine by entering its certificate ID.</p>
              </div>
            </div>
            <Link href="/verify" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shrink-0">
              Verify a Certificate <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── What you can refer ──────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">What you can refer</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Real services for real businesses.</h2>
            <p className="mt-4 text-slate-300">
              RRRTX builds production systems — not template work. Refer clients that need any of the following:
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REFER_TYPES.map((item) => (
              <Link key={item.title} href="/services" className="group rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6">
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Not sure whether a prospect fits? Submit the referral anyway — RRRTX reviews fit during the sales process, and eligibility is confirmed before any commission is recorded.
            </p>
            <Link href="/services" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shrink-0">
              See what we build <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ranks ───────────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Partner ranks</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Progress you can see.</h2>
            <p className="mt-4 text-slate-300">Ranks advance on successful projects or attributed revenue. Each new tier issues an achievement certificate with QR verification.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {RANKS.map((rank) => {
              const badge = RANK_BADGES[rank.key] || RANK_BADGES.starter;
              const BadgeIcon = badge.icon;
              return (
                <div key={rank.key} className="premium-card rounded-2xl p-5 pt-7 text-center">
                  <div className="relative mx-auto mb-5 h-16 w-16">
                    <div className={`absolute -inset-2.5 rounded-full ${badge.glow} blur-lg`} aria-hidden="true" />
                    <div className={`absolute inset-0 rounded-full border-2 ${badge.ring}`} aria-hidden="true" />
                    <div className={`absolute inset-1 rounded-full bg-gradient-to-br ${badge.from} ${badge.to} flex items-center justify-center`}>
                      <BadgeIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border ${badge.ring} bg-[#0b1120] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] ${badge.text}`}>
                      {rank.name}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-300 mb-1">{rank.projects}</p>
                  <p className="text-xs text-slate-400">{rank.revenue}</p>
                  <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">{rank.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Commission ──────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Commission, explained</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Paid when the client pays.</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Commission is calculated on client payments RRRTX actually receives for an attributable qualifying project — not on proposals, and not on signed-but-unpaid work. Refunds and reversals reduce or reverse the corresponding commission.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> Default commission rate: 10% of received client payments.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> Tracked per project and per payment in your dashboard.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> Statuses: pending, payable, paid, cancelled, or reversed.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> No recruitment tiers and no downlines — this is a referral program, not an MLM.</li>
              </ul>
            </div>
            <div className="premium-card rounded-3xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-6">Example</p>
              <div className="space-y-4">
                {[
                  ["Client payment received", "$5,000"],
                  ["Partner commission rate", "10%"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-sm text-slate-300">{label}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-semibold text-white">Commission</span>
                  <span className="text-2xl font-bold text-gradient">$500</span>
                </div>
                <p className="text-xs text-slate-500 pt-2">Illustrative only. Actual amounts depend on the project, payments received, and your Partner Agreement terms.</p>
              </div>
            </div>
          </div>

          {/* ── Commission rules ─────────────────────────── */}
          <div className="mt-10 premium-card rounded-3xl p-8">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { icon: Wallet, title: "Payable when RRRTX is paid.", desc: "Commission tracks payments received, including installments." },
                { icon: FileX, title: "No commission on empty proposals.", desc: "A proposal being issued or accepted does not create commission." },
                { icon: Calculator, title: "Server-side calculations.", desc: "You never enter project values or compute your own commission." },
                { icon: RotateCcw, title: "Refunds are reversible.", desc: "If a client payment is refunded, the related commission may be reversed or offset." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 pt-5 border-t border-white/5 text-xs text-slate-500 leading-relaxed">
              Commission is subject to the Partner Agreement, including eligibility, attribution, refund and clawback rules. Nothing here is a promise of income.
            </p>
          </div>
        </div>
      </section>

      {/* ── Standards & clarity ────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Standards &amp; clarity</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">The program operates on clear rules.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Handshake, title: "A professional referral program.", desc: "RRRTX does not operate a multi-level marketing scheme: no recruitment bonuses, no downlines, no multi-level commissions. Partners earn from qualifying business they directly introduce." },
              { icon: FileSignature, title: "The Partner Agreement governs.", desc: "Every approved partner reads and electronically accepts the RRRTX Partner Network Agreement. Commission, attribution, confidentiality, brand use, taxes, and termination are defined there." },
              { icon: Scale, title: "Governing law.", desc: "The Agreement is governed by the laws of Pakistan, with the parties submitting to the jurisdiction of its courts. Partners outside Pakistan should review the Agreement for how it applies in their own jurisdiction." },
              { icon: Ban, title: "No income guarantees.", desc: "RRRTX does not promise referral volume, sales outcomes, or specific earnings. Results depend on the opportunities you refer and on each client project." },
            ].map((item) => (
              <div key={item.title} className="premium-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-purple-400" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility ─────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              {[
                { icon: UserPlus, label: "Who fits" },
                { icon: BadgeCheck, label: "Who we look for" },
              ].map((c) => (
                <div key={c.label} className="premium-card rounded-2xl p-6">
                  <c.icon className="w-5 h-5 text-purple-400 mb-3" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-white">{c.label}</h3>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Eligibility</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">A good partner opens doors.</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                We approve partners who genuinely know business owners that need engineering work: agency owners, consultants, fractional operators, and professionals in ecommerce, SaaS, and B2B services. Every applicant is reviewed individually.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> You can represent RRRTX accurately and professionally.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> You have a realistic plan for how you will make introductions.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" aria-hidden="true" /> You understand partners refer — they do not sign, price, or deliver for RRRTX.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Questions</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Answers before you apply.</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-slate-800/60 bg-slate-950/40 p-5">
                <summary className="cursor-pointer list-none flex items-center gap-3 text-base font-semibold text-white">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-cyan-400 shrink-0" aria-hidden="true">?</span>
                  {faq.q}
                  <span className="ml-auto text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                </summary>
                <p className="mt-4 pl-9 text-sm leading-7 text-slate-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section data-reveal className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-10 lg:p-14 text-center">
            <div className="absolute left-1/2 top-0 h-40 w-[560px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[90px]" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Bring the relationship. We build the technology.</h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-8">Applications are reviewed by the RRRTX team. Approved partners receive a Partner ID, a signed agreement, a Joining Letter, and a verifiable Partnership Certificate.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/partners/apply" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-sm font-semibold text-white">
                  Apply to Become a Partner <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link href="/partner/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/40 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-colors">
                  Partner Login
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-500 max-w-xl mx-auto">
                By applying you agree that your details will be processed to review your application and, if approved, administer the program. Commission and participation are governed by the RRRTX Partner Network Agreement, not by this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
