"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsClient";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all";
const labelClass = "block text-sm font-medium text-slate-300 mb-2";
const hintClass = "mt-2 text-xs text-slate-500";
const fieldErrorClass = "mt-2 text-xs text-red-400";

/** Kept in step with the server rule in src/app/api/partner/apply/route.ts. */
const MIN_NARRATIVE_LENGTH = 20;

const NARRATIVE_LABELS: Record<"whyPartner" | "howRefer", string> = {
  whyPartner: "Why do you want to partner with RRRTX?",
  howRefer: "How would you refer opportunities?",
};

function Field({
  label,
  required,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-cyan-400 ml-0.5" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className={hintClass}>{hint}</p>}
      {error && (
        <p className={fieldErrorClass} id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </p>
      )}
    </div>
  );
}

export function ApplyClient() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [applicationId, setApplicationId] = useState<string | null>(null);
  // Guards against a second submit landing before React re-renders the button.
  const inFlight = useRef(false);
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

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      // Clear a field-level error as soon as the visitor starts fixing it.
      setFieldErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };

  /** Mirrors the server rules so visitors get feedback before any request is sent. */
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.country.trim()) errors.country = "Please enter your country.";

    const narratives: Array<"whyPartner" | "howRefer"> = ["whyPartner", "howRefer"];
    for (const key of narratives) {
      const value = form[key].trim();
      if (value.length < MIN_NARRATIVE_LENGTH) {
        errors[key] = `${NARRATIVE_LABELS[key]} needs at least ${MIN_NARRATIVE_LENGTH} characters — currently ${value.length}.`;
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    const errors = validate();
    setFieldErrors(errors);
    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      setError("Please correct the highlighted fields before submitting.");
      const el = document.getElementById(`partner-apply-${firstInvalid}`);
      el?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setError("");
    trackEvent("partner_apply_started", {});
    try {
      const res = await fetch("/api/partner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        trackEvent("partner_application_submitted", { application_id: data.applicationId || "" });
        setApplicationId(data.applicationId || null);
      } else {
        // A server-side field error keeps the visitor's answers intact.
        if (typeof data.field === "string") {
          setFieldErrors({ [data.field]: data.error || "Please check this field." });
        }
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Your answers are still here — please try again.");
    } finally {
      inFlight.current = false;
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

        {/* Native constraint validation (required / minLength / type=email) stays
            active as the first line; validate() adds matching inline messages. */}
        <form onSubmit={handleSubmit} className="space-y-6 premium-form">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">About you</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" required htmlFor="partner-apply-name" error={fieldErrors.name}>
                <input
                  id="partner-apply-name"
                  className={inputClass}
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "partner-apply-name-error" : undefined}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" required htmlFor="partner-apply-email" error={fieldErrors.email}>
                <input
                  id="partner-apply-email"
                  className={inputClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "partner-apply-email-error" : undefined}
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone" htmlFor="partner-apply-phone">
                <input
                  id="partner-apply-phone"
                  className={inputClass}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+92 300 0000000"
                />
              </Field>
              <Field label="Country" required htmlFor="partner-apply-country" error={fieldErrors.country}>
                <input
                  id="partner-apply-country"
                  className={inputClass}
                  name="country"
                  autoComplete="country-name"
                  required
                  aria-invalid={Boolean(fieldErrors.country)}
                  aria-describedby={fieldErrors.country ? "partner-apply-country-error" : undefined}
                  value={form.country}
                  onChange={set("country")}
                  placeholder="Pakistan"
                />
              </Field>
              <Field label="Your role" htmlFor="partner-apply-role">
                <input
                  id="partner-apply-role"
                  className={inputClass}
                  name="role"
                  autoComplete="organization-title"
                  value={form.role}
                  onChange={set("role")}
                  placeholder="Agency owner, consultant, freelancer…"
                />
              </Field>
              <Field label="Company (optional)" htmlFor="partner-apply-company">
                <input
                  id="partner-apply-company"
                  className={inputClass}
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Company name"
                />
              </Field>
              <Field label="Website" htmlFor="partner-apply-website">
                <input
                  id="partner-apply-website"
                  className={inputClass}
                  name="website"
                  type="url"
                  autoComplete="url"
                  value={form.website}
                  onChange={set("website")}
                  placeholder="https://"
                />
              </Field>
              <Field label="LinkedIn" htmlFor="partner-apply-linkedin">
                <input
                  id="partner-apply-linkedin"
                  className={inputClass}
                  name="linkedin"
                  type="url"
                  autoComplete="url"
                  value={form.linkedin}
                  onChange={set("linkedin")}
                  placeholder="https://linkedin.com/in/…"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-white">Your referral background</h2>
            <Field label="What is your experience with referrals or business development?" htmlFor="partner-apply-experience">
              <textarea
                id="partner-apply-experience"
                className={`${inputClass} min-h-[90px]`}
                name="experience"
                value={form.experience}
                onChange={set("experience")}
                placeholder="Industries you know, how you typically make introductions…"
              />
            </Field>
            <Field
              label="Who could you refer? Describe the kinds of businesses you would introduce."
              required
              htmlFor="partner-apply-referralBackground"
            >
              <textarea
                id="partner-apply-referralBackground"
                className={`${inputClass} min-h-[90px]`}
                name="referralBackground"
                required
                value={form.referralBackground}
                onChange={set("referralBackground")}
                placeholder="E.g., ecommerce brands, B2B agencies, SaaS companies…"
              />
            </Field>
            <Field
              label="Why do you want to partner with RRRTX?"
              required
              htmlFor="partner-apply-whyPartner"
              error={fieldErrors.whyPartner}
              hint="A sentence or two is enough."
            >
              <textarea
                id="partner-apply-whyPartner"
                className={`${inputClass} min-h-[90px]`}
                name="whyPartner"
                required
                minLength={MIN_NARRATIVE_LENGTH}
                aria-invalid={Boolean(fieldErrors.whyPartner)}
                aria-describedby={fieldErrors.whyPartner ? "partner-apply-whyPartner-error" : undefined}
                value={form.whyPartner}
                onChange={set("whyPartner")}
                placeholder="Be specific."
              />
            </Field>
            <Field
              label="How would you refer opportunities?"
              required
              htmlFor="partner-apply-howRefer"
              error={fieldErrors.howRefer}
              hint="A sentence or two is enough."
            >
              <textarea
                id="partner-apply-howRefer"
                className={`${inputClass} min-h-[90px]`}
                name="howRefer"
                required
                minLength={MIN_NARRATIVE_LENGTH}
                aria-invalid={Boolean(fieldErrors.howRefer)}
                aria-describedby={fieldErrors.howRefer ? "partner-apply-howRefer-error" : undefined}
                value={form.howRefer}
                onChange={set("howRefer")}
                placeholder="Through your network, content, events…"
              />
            </Field>
          </div>

          {/* Honeypot — hidden from humans, filled by bots. */}
          <div className="hidden" aria-hidden="true">
            <input tabIndex={-1} autoComplete="off" name="hpot" value={form.hpot} onChange={set("hpot")} />
          </div>

          <div className="flex items-start gap-3 text-xs text-slate-500">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <p>
              Your details are used only to review your application and, if approved, to administer the Partner Network. We do not sell or share application data with third parties. See our{" "}
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              for how we handle your information.
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
