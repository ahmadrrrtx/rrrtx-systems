"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, RefreshCw, SearchCheck, Gauge, Target, ShieldCheck, AlertCircle } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsClient";

const reviewAreas = [
  { icon: Target, title: "Clarity & conversion", text: "Offer, audience, calls to action, forms, and buyer friction." },
  { icon: Gauge, title: "Performance & UX", text: "Loading, mobile behavior, accessibility, and Core Web Vitals risks." },
  { icon: SearchCheck, title: "Search foundations", text: "Indexability, metadata, structure, internal links, and content opportunities." },
  { icon: ShieldCheck, title: "Systems opportunity", text: "Automation, lead routing, integrations, ownership, and delivery risk." },
];

export default function AuditClient() {
  const [form, setForm] = useState({ name: "", email: "", websiteUrl: "", businessType: "Ecommerce", helpWith: "Conversion Rate Optimization", website: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "The audit request could not be submitted.");
        return;
      }
      setSubmitted(true);
      trackEvent("audit_request", { business_type: form.businessType, primary_need: form.helpWith });
    } catch {
      setError("A network error interrupted the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <section className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Conversion Engineering</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">Free Systems & <span className="text-gradient">Conversion Audit.</span></h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
              Request a focused review of the technical and conversion constraints holding your website back.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {reviewAreas.map((area) => (
              <div key={area.title} className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5">
                <area.icon className="w-5 h-5 text-cyan-400 mb-3" aria-hidden="true" />
                <h2 className="text-sm font-bold text-white mb-2">{area.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{area.text}</p>
              </div>
            ))}
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-white mb-3">Audit request received</h2>
              <p className="text-slate-300 leading-relaxed mb-6">An RRRTX Systems engineer will review the information you submitted. We do not generate random scores or pretend to have crawled a site before a real review takes place.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/resources" className="px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white">Explore resources</Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">Discuss the project <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 sm:p-9 space-y-5">
              <div className="hidden" aria-hidden="true"><label htmlFor="audit-website">Leave this field empty</label><input id="audit-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="audit-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Your name</label><input id="audit-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm" /></div>
                <div><label htmlFor="audit-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Work email</label><input id="audit-email" name="email" autoComplete="email" required type="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm" /></div>
              </div>
              <div><label htmlFor="audit-url" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Website URL</label><input id="audit-url" name="websiteUrl" required type="url" maxLength={2048} placeholder="https://yourcompany.com" value={form.websiteUrl} onChange={(event) => setForm({ ...form, websiteUrl: event.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500" /></div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="audit-business" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business type</label><select id="audit-business" name="businessType" value={form.businessType} onChange={(event) => setForm({ ...form, businessType: event.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"><option>Ecommerce</option><option>B2B Services</option><option>SaaS</option><option>Agency</option><option>Other</option></select></div>
                <div><label htmlFor="audit-need" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Primary need</label><select id="audit-need" name="helpWith" value={form.helpWith} onChange={(event) => setForm({ ...form, helpWith: event.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"><option>Conversion Rate Optimization</option><option>Performance & UX</option><option>SEO & AEO</option><option>AI Automation</option><option>Full Rebuild</option></select></div>
              </div>
              {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />{error}</div>}
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white disabled:opacity-50">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />Submitting request…</> : <>Request my audit <ArrowRight className="w-4 h-4" aria-hidden="true" /></>}
              </button>
              <p className="text-xs text-slate-400 text-center">Submitting this form requests a review; it does not trigger an automated crawl. See our <Link href="/privacy" className="text-cyan-300 underline underline-offset-2">privacy policy</Link>.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
