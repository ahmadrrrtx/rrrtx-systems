"use client";

import { useEffect, useState } from "react";
import { Handshake, Plus, X } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsClient";

const STATUS_BADGE: Record<string, string> = {
  submitted: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  under_review: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  contacted: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  discovery: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  proposal: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  negotiation: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
  won: "bg-green-500/10 text-green-300 border-green-500/25",
  lost: "bg-red-500/10 text-red-300 border-red-500/25",
};

const STATUS_ORDER = ["submitted", "under_review", "contacted", "discovery", "proposal", "negotiation", "won", "lost"];

interface Referral {
  id: number;
  referralId: string;
  businessName: string;
  contactName: string | null;
  service: string | null;
  industry: string | null;
  budget: string | null;
  status: string;
  createdAt: string;
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all";
const labelClass = "block text-sm font-medium text-slate-300 mb-2";

const SERVICES = ["Custom Ecommerce", "AI Automation & Agents", "Lead Generation System", "Website Rebuild", "Chatbot / AI Assistant", "SEO & AEO", "Not sure yet"];

export default function PartnerReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    industry: "",
    service: "",
    budget: "",
    relationship: "",
    notes: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const fetchReferrals = async () => {
    try {
      const res = await fetch("/api/partner/referrals");
      if (res.ok) setReferrals(await res.json());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchReferrals(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/partner/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        trackEvent("partner_referral_submitted", { referral_id: data.referralId || "" });
        setSuccess(`Referral submitted: ${data.referralId}`);
        setShowForm(false);
        setForm({ businessName: "", contactName: "", contactEmail: "", contactPhone: "", website: "", industry: "", service: "", budget: "", relationship: "", notes: "" });
        await fetchReferrals();
      } else {
        setError(data.error || "Could not submit referral");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Referrals</h1>
          <p className="text-sm text-slate-400">Introduce prospective clients. RRRTX qualifies and updates each status.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          {showForm ? <X className="w-4 h-4" aria-hidden="true" /> : <Plus className="w-4 h-4" aria-hidden="true" />}
          {showForm ? "Close" : "New referral"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 space-y-5 premium-form">
          <h2 className="text-sm font-semibold text-white">New referral</h2>
          {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">{error}</div>}
          {success && <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400" role="status">{success}</div>}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Business name <span className="text-cyan-400">*</span></label>
              <input className={inputClass} required value={form.businessName} onChange={set("businessName")} placeholder="The company you are introducing" />
            </div>
            <div>
              <label className={labelClass}>Contact name</label>
              <input className={inputClass} value={form.contactName} onChange={set("contactName")} placeholder="Decision maker, if known" />
            </div>
            <div>
              <label className={labelClass}>Contact email</label>
              <input className={inputClass} type="email" value={form.contactEmail} onChange={set("contactEmail")} placeholder="name@company.com" />
            </div>
            <div>
              <label className={labelClass}>Contact phone</label>
              <input className={inputClass} type="tel" value={form.contactPhone} onChange={set("contactPhone")} placeholder="+92…" />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input className={inputClass} type="url" value={form.website} onChange={set("website")} placeholder="https://" />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <input className={inputClass} value={form.industry} onChange={set("industry")} placeholder="Ecommerce, SaaS, B2B services…" />
            </div>
            <div>
              <label className={labelClass}>Requested service</label>
              <select className={inputClass} value={form.service} onChange={set("service")}>
                <option value="">Select a service…</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estimated budget</label>
              <input className={inputClass} value={form.budget} onChange={set("budget")} placeholder="e.g. $5,000 – $15,000" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Your relationship to the prospect</label>
            <textarea className={`${inputClass} min-h-[80px]`} value={form.relationship} onChange={set("relationship")} placeholder="How you know them and why the timing is right" />
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea className={`${inputClass} min-h-[80px]`} value={form.notes} onChange={set("notes")} placeholder="Anything RRRTX should know before reaching out" />
          </div>
          <button type="submit" disabled={submitting} className="premium-button inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {submitting ? "Submitting…" : "Submit referral"}
          </button>
        </form>
      )}

      <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
        <div className="p-5 border-b border-slate-800/50 flex items-center gap-2">
          <Handshake className="w-4 h-4 text-cyan-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Your referrals ({referrals.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : referrals.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No referrals yet. Submit your first introduction above.</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {referrals.map((r) => {
              const stepIndex = STATUS_ORDER.indexOf(r.status);
              return (
                <div key={r.referralId} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white">{r.businessName}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${STATUS_BADGE[r.status] || STATUS_BADGE.submitted}`}>
                          {r.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span className="font-mono">{r.referralId}</span>
                        {r.service && <span className="text-cyan-400">{r.service}</span>}
                        {r.budget && <span className="text-purple-400">{r.budget}</span>}
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {/* status pipeline */}
                  <div className="mt-3 flex items-center gap-1" aria-hidden="true">
                    {STATUS_ORDER.map((s, i) => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full ${i < stepIndex ? "bg-green-500/60" : i === stepIndex ? "bg-cyan-400" : "bg-slate-800"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-1.5 flex justify-between text-[9px] uppercase tracking-wide text-slate-600">
                    <span>Submitted</span>
                    <span className="hidden sm:inline">Discovery</span>
                    <span>Won</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
