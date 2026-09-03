"use client";

import { useEffect, useState } from "react";
import { DollarSign, Plus, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface PartnerOption {
  id: number;
  partnerId: string;
  name: string;
}

interface Commission {
  id: number;
  projectName: string;
  projectValue: number;
  amountReceived: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  payableDate: string | null;
  paidDate: string | null;
  paymentReference: string | null;
  referralRef: string | null;
  createdAt: string;
  partner: { partnerId: string; name: string } | null;
}

const BADGE: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  payable: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  paid: "bg-green-500/10 text-green-300 border-green-500/25",
  cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/25",
  reversed: "bg-red-500/10 text-red-300 border-red-500/25",
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm";

export default function PartnerCommissionsAdmin() {
  const [rows, setRows] = useState<Commission[]>([]);
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ partnerId: "", projectName: "", projectValue: "", amountReceived: "", commissionRate: "" });

  const fetchRows = async () => {
    try {
      const [commRes, partRes] = await Promise.all([
        fetch("/api/partner/admin/commissions"),
        fetch("/api/partner/admin/partners"),
      ]);
      if (commRes.ok) setRows(await commRes.json());
      if (partRes.ok) setPartners(await partRes.json());
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

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const createCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/partner/admin/commissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: Number(form.partnerId),
        projectName: form.projectName,
        projectValue: Number(form.projectValue || 0),
        amountReceived: Number(form.amountReceived || 0),
        commissionRate: form.commissionRate ? Number(form.commissionRate) / 100 : 0,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Commission created (${money(data.commissionAmount)}).`);
      setShowForm(false);
      setForm({ partnerId: "", projectName: "", projectValue: "", amountReceived: "", commissionRate: "" });
      await fetchRows();
    } else {
      setMessage(data.error || "Failed to create commission");
    }
  };

  const act = async (id: number, action: string, extra: Record<string, unknown> = {}) => {
    setMessage("");
    const res = await fetch("/api/partner/admin/commissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...extra }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Updated." : data.error || "Update failed");
    await fetchRows();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Commissions</h1>
            <p className="text-sm text-slate-400">Record received payments and manage payouts. All math happens server-side.</p>
          </div>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} Record payment
          </button>
        </div>

        {message && <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-200" role="status">{message}</div>}

        {showForm && (
          <form onSubmit={createCommission} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 space-y-4 premium-form">
            <h2 className="text-sm font-semibold text-white">New commission record</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Partner *</label>
                <select className={inputClass} required value={form.partnerId} onChange={set("partnerId")}>
                  <option value="">Select partner…</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.partnerId})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project name *</label>
                <input className={inputClass} required value={form.projectName} onChange={set("projectName")} placeholder="e.g. Custom storefront build" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Total project value (USD)</label>
                <input className={inputClass} type="number" step="0.01" min="0" value={form.projectValue} onChange={set("projectValue")} placeholder="5000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Payment received (USD)</label>
                <input className={inputClass} type="number" step="0.01" min="0" value={form.amountReceived} onChange={set("amountReceived")} placeholder="2500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Commission rate (%) — leave 0 for partner default</label>
                <input className={inputClass} type="number" step="0.5" min="0" max="50" value={form.commissionRate} onChange={set("commissionRate")} placeholder="10" />
              </div>
            </div>
            <button type="submit" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white">
              Create record
            </button>
          </form>
        )}

        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800/50 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Commission records ({rows.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No commissions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/50 text-left text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3 font-medium">Partner</th>
                    <th className="px-5 py-3 font-medium">Project</th>
                    <th className="px-5 py-3 font-medium">Value</th>
                    <th className="px-5 py-3 font-medium">Received</th>
                    <th className="px-5 py-3 font-medium">Commission</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td className="px-5 py-3.5">
                        <p className="text-white font-medium">{c.partner?.name || "—"}</p>
                        <p className="text-xs text-slate-500 font-mono">{c.partner?.partnerId}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-white">{c.projectName}</p>
                        {c.referralRef && <p className="text-xs text-slate-500 font-mono">{c.referralRef}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{money(c.projectValue)}</td>
                      <td className="px-5 py-3.5 text-slate-300">{money(c.amountReceived)}</td>
                      <td className="px-5 py-3.5 text-cyan-300 font-semibold">{money(c.commissionAmount)} <span className="text-slate-500 text-xs font-normal">({Math.round(c.commissionRate * 100)}%)</span></td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${BADGE[c.status] || BADGE.pending}`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {c.status === "pending" && (
                            <button type="button" onClick={() => act(c.id, "mark_payable")} className="px-2 py-1 rounded-md text-[11px] font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">Mark payable</button>
                          )}
                          {(c.status === "pending" || c.status === "payable") && (
                            <button type="button" onClick={() => act(c.id, "mark_paid")} className="px-2 py-1 rounded-md text-[11px] font-semibold bg-green-500/15 border border-green-500/30 text-green-300">Mark paid</button>
                          )}
                          {c.status !== "cancelled" && c.status !== "paid" && (
                            <button type="button" onClick={() => act(c.id, "cancelled")} className="px-2 py-1 rounded-md text-[11px] border border-slate-700/70 text-slate-400">Cancel</button>
                          )}
                          {c.status === "paid" && (
                            <button type="button" onClick={() => act(c.id, "reversed")} className="px-2 py-1 rounded-md text-[11px] font-semibold bg-red-500/10 border border-red-500/30 text-red-300">Reverse</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
