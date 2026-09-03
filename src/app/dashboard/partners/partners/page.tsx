"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { rankColorClass, rankLabel } from "@/lib/partner-constants";

interface Partner {
  id: number;
  partnerId: string;
  name: string;
  email: string;
  country: string | null;
  company: string | null;
  rank: string;
  commissionRate: number;
  status: string;
  joinDate: string;
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-500/10 text-green-300 border-green-500/25",
  suspended: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  terminated: "bg-red-500/10 text-red-300 border-red-500/25",
};

const RANKS = ["starter", "bronze", "silver", "gold", "platinum", "elite"];

export default function PartnerAccounts() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partner/admin/partners");
      if (res.ok) setPartners(await res.json());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchPartners(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const act = async (id: number, action: string, payload: Record<string, unknown>) => {
    setMessage("");
    const res = await fetch("/api/partner/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...payload }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Updated." : data.error || "Update failed");
    await fetchPartners();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Partner accounts</h1>
          <p className="text-sm text-slate-400">Manage partner status, ranks, and commission rates.</p>
        </div>

        {message && <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-200" role="status">{message}</div>}

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-800/50 bg-slate-950/40">
            <Users className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No partners yet. Approve an application to create the first account.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {partners.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-800/50 bg-slate-950/40 p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-semibold text-white">{p.name}</h2>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${rankColorClass(p.rank)}`}>{rankLabel(p.rank)}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${STATUS_BADGE[p.status] || STATUS_BADGE.active}`}>{p.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-cyan-300">{p.partnerId}</span>
                      <span>{p.email}</span>
                      {p.company && <span>· {p.company}</span>}
                      <span>Joined {new Date(p.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={p.rank}
                      onChange={(e) => act(p.id, "rank", { rank: e.target.value })}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                      aria-label={`Rank for ${p.name}`}
                    >
                      {RANKS.map((r) => (
                        <option key={r} value={r}>{rankLabel(r)}</option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="0.5"
                        value={rates[p.id] ?? Math.round(p.commissionRate * 100)}
                        onChange={(e) => setRates((r) => ({ ...r, [p.id]: e.target.value }))}
                        className="w-16 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                        aria-label={`Commission rate for ${p.name}`}
                      />
                      <span className="text-xs text-slate-500">%</span>
                      <button type="button" onClick={() => act(p.id, "rate", { commissionRate: (Number(rates[p.id] ?? Math.round(p.commissionRate * 100)) / 100) })} className="px-2 py-1.5 rounded-lg text-xs border border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-slate-600">
                        Set
                      </button>
                    </div>

                    {p.status !== "active" && (
                      <button type="button" onClick={() => act(p.id, "status", { status: "active" })} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-300">
                        Reactivate
                      </button>
                    )}
                    {p.status === "active" && (
                      <button type="button" onClick={() => act(p.id, "status", { status: "suspended" })} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
                        Suspend
                      </button>
                    )}
                    {p.status !== "terminated" && (
                      <button type="button" onClick={() => act(p.id, "status", { status: "terminated" })} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-300">
                        Terminate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
