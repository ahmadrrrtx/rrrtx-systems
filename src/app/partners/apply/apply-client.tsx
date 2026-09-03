"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsClient";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all";
const labelClass = "block text-sm font-medium text-slate-300 mb-2";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-cyan-400 ml-0.5" aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function ApplyClient() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    role: "",
    company: "",
    website: "",
    linkedin: "",
    experience: "",
    referralBackground: "",
    whyPartner: "",
    howRefer: "",
    hpot: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    trackEvent("partner_apply_started", {});
    try {
      const res = await fetch("/api/partner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        trackEvent("partner_application_submitted", { application_id: data.applicationId || "" });
        setApplicationId(data.applicationId || null);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (applicationId) {
    return (
      <section className="pt-32 pb-24">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card rounded-3xl p-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Application received</h1>
            <p className="text-sm text-slate-400 mb-6">
              Thank you. Our team will review your application and contact you by email with next steps.
            </p>
            <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">Your application ID</p>
              <p className="text-lg font-semibold text-cyan-300 font-mono">{applicationId}</p>
            </div>
            <Link href="/partners" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Partner Network
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/partners" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Partner Network
        </Link>
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Partner application</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Tell us who you are.</h1>
          <p className="text-slate-300 max-w-2xl">
            We review every application individually. Be specific about who you know and how you would introduce them — it materially improves your application.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 premium-form">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">About you</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" required>
                <input className={inputClass} name="name" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="Your name" />
              </Field>
              <Field label="Email" required>
                <input className={inputClass} name="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} placeholder="you@example.com" />
              </Field>
              <Field label="Phone">
                <input className={inputClass} name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="+92 300 0000000" />
              </Field>
              <Field label="Country" required>
                <input className={inputClass} name="country" required value={form.country} onChange={set("country")} placeholder="Pakistan" />
              </Field>
              <Field label="Your role">
                <input className={inputClass} name="role" value={form.role} onChange={set("role")} placeholder="Agency owner, consultant, freelancer…" />
              </Field>
              <Field label="Company (optional)">
                <input className={inputClass} name="company" value={form.company} onChange={set("company")} placeholder="Company name" />
              </Field>
              <Field label="Website">
                <input className={inputClass} name="website" type="url" value={form.website} onChange={set("website")} placeholder="https://" />
              </Field>
              <Field label="LinkedIn">
                <input className={inputClass} name="linkedin" type="url" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Your referral background</h2>
            <Field label="What is your experience with referrals or business development?">
              <textarea className={`${inputClass} min-h-[90px]`} name="experience" value={form.experience} onChange={set("experience")} placeholder="Industries you know, how you typically make introductions…" />
            </Field>
            <Field label="Who could you refer? Describe the kinds of businesses you would introduce." required>
              <textarea className={`${inputClass} min-h-[90px]`} name="referralBackground" required value={form.referralBackground} onChange={set("referralBackground")} placeholder="E.g., ecommerce brands, B2B agencies, SaaS companies…" />
            </Field>
            <Field label="Why do you want to partner with RRRTX?" required>
              <textarea className={`${inputClass} min-h-[90px]`} name="whyPartner" required value={form.whyPartner} onChange={set("whyPartner")} placeholder="Be specific." />
            </Field>
            <Field label="How would you refer opportunities?" required>
              <textarea className={`${inputClass} min-h-[90px]`} name="howRefer" required value={form.howRefer} onChange={set("howRefer")} placeholder="Through your network, content, events…" />
            </Field>
          </div>

          {/* Honeypot — hidden from humans, filled by bots. */}
          <div className="hidden" aria-hidden="true">
            <input tabIndex={-1} autoComplete="off" name="hpot" value={form.hpot} onChange={set("hpot")} />
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-500">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              Your details are used only to review your application and, if approved, to administer the Partner Network. We do not sell or share application data with third parties.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="premium-button inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Application"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
