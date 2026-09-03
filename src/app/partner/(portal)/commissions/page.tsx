"use client";

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";

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
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  payable: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  paid: "bg-green-500/10 text-green-300 border-green-500/25",
  cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/25",
  reversed: "bg-red-500/10 text-red-300 border-red-500/25",
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function PartnerCommissions() {
  const [rows, setRows] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/commissions");
        if (res.ok) setRows(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = {
    payable: rows.filter((r) => r.status === "payable").reduce((s, r) => s + r.commissionAmount, 0),
    paid: rows.filter((r) => r.status === "paid").reduce((s, r) => s + r.commissionAmount, 0),
    pending: rows.filter((r) => r.status === "pending" || r.status === "payable").reduce((s, r) => s + r.commissionAmount, 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Commissions</h1>
        <p className="text-sm text-slate-400">Commission is calculated on client payments received for your referred projects.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Pending + payable", value: money(totals.pending), color: "text-yellow-400" },
          { label: "Payable now", value: money(totals.payable), color: "text-cyan-400" },
          { label: "Paid to date", value: money(totals.paid), color: "text-green-400" },
        ].map((t) => (
          <div key={t.label} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className={`w-3.5 h-3.5 ${t.color}`} aria-hidden="true" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{t.label}</span>
            </div>
            <div className={`text-xl font-bold ${t.color}`}>{t.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
        <div className="p-5 border-b border-slate-800/50">
          <h2 className="text-sm font-semibold text-white">Commission records ({rows.length})</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No commissions yet. They appear once a referred project receives payment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/50 text-left text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Received</th>
                  <th className="px-5 py-3 font-medium">Rate</th>
                  <th className="px-5 py-3 font-medium">Commission</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{c.projectName}</p>
                      {c.referralRef && <p className="text-xs text-slate-500 font-mono">{c.referralRef}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{money(c.amountReceived)}</td>
                    <td className="px-5 py-3.5 text-slate-300">{Math.round(c.commissionRate * 100)}%</td>
                    <td className="px-5 py-3.5 text-cyan-300 font-semibold">{money(c.commissionAmount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${STATUS_BADGE[c.status] || STATUS_BADGE.pending}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {c.paidDate ? new Date(c.paidDate).toLocaleDateString() : "—"}
                      {c.paymentReference && <span className="block text-slate-600 font-mono">{c.paymentReference}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">Project values, payment amounts, and statuses are entered and managed by RRRTX. Partners cannot edit financial data.</p>
    </div>
  );
}
