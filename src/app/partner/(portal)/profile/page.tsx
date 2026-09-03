"use client";

import { useEffect, useState } from "react";
import { rankColorClass, rankLabel } from "@/lib/partner-constants";

interface Profile {
  partnerId: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  company: string | null;
  website: string | null;
  linkedin: string | null;
  role: string | null;
  rank: string;
  commissionRate: number;
  joinDate: string;
  status: string;
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all";
const labelClass = "block text-sm font-medium text-slate-300 mb-2";

export default function PartnerProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: "", company: "", country: "", phone: "", website: "", linkedin: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/profile");
        if (res.ok) {
          const data: Profile = await res.json();
          setProfile(data);
          setForm({
            name: data.name,
            company: data.company || "",
            country: data.country || "",
            phone: data.phone || "",
            website: data.website || "",
            linkedin: data.linkedin || "",
          });
        }
      } catch {
        /* noop */
      }
    })();
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((p) => (p ? { ...p, ...data } : p));
        setMessage("Profile updated.");
      } else {
        setMessage(data.error || "Could not update profile.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-8 text-center text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-slate-400">Your account details and program status.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Partner ID", value: profile.partnerId, mono: true },
          { label: "Current rank", value: rankLabel(profile.rank), badge: true },
          { label: "Commission rate", value: `${Math.round(profile.commissionRate * 100)}%` },
          { label: "Joined", value: new Date(profile.joinDate).toLocaleDateString() },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{item.label}</p>
            {item.badge ? (
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${rankColorClass(profile.rank)}`}>{item.value}</span>
            ) : (
              <p className={`text-lg font-bold text-white ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 space-y-5 premium-form">
        <h2 className="text-sm font-semibold text-white">Edit details</h2>
        {message && <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-300" role="status">{message}</div>}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="pf-name">Full name</label>
            <input id="pf-name" className={inputClass} value={form.name} onChange={set("name")} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-company">Company</label>
            <input id="pf-company" className={inputClass} value={form.company} onChange={set("company")} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-country">Country</label>
            <input id="pf-country" className={inputClass} value={form.country} onChange={set("country")} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-phone">Phone</label>
            <input id="pf-phone" className={inputClass} value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-website">Website</label>
            <input id="pf-website" className={inputClass} type="url" value={form.website} onChange={set("website")} placeholder="https://" />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-linkedin">LinkedIn</label>
            <input id="pf-linkedin" className={inputClass} type="url" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" />
          </div>
        </div>
        <p className="text-xs text-slate-500">Email and Partner ID cannot be changed here — contact RRRTX for account changes.</p>
        <button type="submit" disabled={saving} className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
