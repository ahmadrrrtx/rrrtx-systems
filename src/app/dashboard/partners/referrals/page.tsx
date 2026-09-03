"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { REFERRAL_STATUSES } from "@/lib/partner-constants";

interface Referral {
  id: number;
  referralId: string;
  businessName: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  industry: string | null;
  service: string | null;
  budget: string | null;
  relationship: string | null;
  notes: string | null;
  status: string;
  leadId: number | null;
  createdAt: string;
  partner: { partnerId: string; name: string; email: string } | null;
}

const BADGE: Record<string, string> = {
  submitted: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  under_review: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  contacted: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  discovery: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  proposal: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  negotiation: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
  won: "bg-green-500/10 text-green-300 border-green-500/25",
  lost: "bg-red-500/10 text-red-300 border-red-500/25",
};

export default function PartnerReferralsAdmin() {
  const [rows, setRows] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [leads, setLeads] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/partner/admin/referrals");
      if (res.ok) setRows(await res.json());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchRows(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setMessage("");
    const res = await fetch("/api/partner/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Updated." : data.error || "Update failed");
    await fetchRows();
  };

  const saveLeadLink = async (id: number) => {
    setMessage("");
    const raw = leads[id];
    if (!raw) return;
    const leadId = Number(raw);
    const res = await fetch("/api/partner/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, leadId: Number.isInteger(leadId) ? leadId : null }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Lead linked." : data.error || "Update failed");
    await fetchRows();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Partner referrals</h1>
          <p className="text-sm text-slate-400">Track and update the status of every referral.</p>
        </div>

        {message && <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-200" role="status">{message}</div>}

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-800/50 bg-slate-950/40">
            <Target className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No referrals yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-800/50 bg-slate-950/40 p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-semibold text-white">{r.businessName}</h2>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${BADGE[r.status] || BADGE.submitted}`}>
                        {r.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-300">{r.referralId}</span>
                      {r.partner && <span>by <span className="text-slate-300">{r.partner.name}</span> ({r.partner.partnerId})</span>}
                      {r.service && <span>· {r.service}</span>}
                      {r.budget && <span>· {r.budget}</span>}
                    </div>
                    {r.contactEmail && <p className="text-xs text-slate-500 mt-1">{r.contactName || "Contact"}: {r.contactEmail}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                      aria-label={`Status for ${r.businessName}`}
                    >
                      {REFERRAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Lead ID"
                        value={leads[r.id] ?? (r.leadId ? String(r.leadId) : "")}
                        onChange={(e) => setLeads((m) => ({ ...m, [r.id]: e.target.value }))}
                        className="w-20 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                        aria-label={`Lead ID for ${r.businessName}`}
                      />
                      <button type="button" onClick={() => saveLeadLink(r.id)} className="px-2 py-1.5 rounded-lg text-xs border border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-slate-600">
                        Link
                      </button>
                    </div>
                    <button type="button" onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="px-3 py-1.5 rounded-lg text-xs border border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-slate-600">
                      {expanded === r.id ? "Hide" : "Notes"}
                    </button>
                  </div>
                </div>
                {expanded === r.id && (
                  <div className="mt-4 pt-4 border-t border-slate-800/50 text-sm text-slate-300 space-y-2">
                    {r.relationship && <p><span className="text-slate-500 text-xs uppercase tracking-wider">Relationship: </span>{r.relationship}</p>}
                    {r.notes && <p><span className="text-slate-500 text-xs uppercase tracking-wider">Notes: </span>{r.notes}</p>}
                    {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-xs">Website ↗</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
