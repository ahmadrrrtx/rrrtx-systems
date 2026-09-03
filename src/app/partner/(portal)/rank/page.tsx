"use client";

import { useEffect, useState } from "react";
import { Award, Check, Lock } from "lucide-react";
import { rankColorClass } from "@/lib/partner-constants";

interface Tier {
  key: string;
  label: string;
  minProjects: number;
  minRevenue: number;
  sortOrder: number;
  isAutomatic: boolean;
  achieved: boolean;
}

interface HistoryItem {
  id: number;
  previousRank: string;
  newRank: string;
  reason: string | null;
  actor: string;
  createdAt: string;
}

interface RankData {
  currentRank: string;
  wonProjects: number;
  attributedRevenue: number;
  tiers: Tier[];
  progress: { nextKey: string; nextLabel: string; projects: number; projectsTarget: number; revenue: number; revenueTarget: number } | null;
  history: HistoryItem[];
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function PartnerRank() {
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/rank");
        if (res.ok) setData(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading…</div>;
  if (!data) return <div className="p-8 text-center text-sm text-slate-500">Could not load rank data.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Rank & Achievements</h1>
        <p className="text-sm text-slate-400">
          {data.wonProjects} successful projects · {money(data.attributedRevenue)} attributed revenue
        </p>
      </div>

      {data.progress && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Next: {data.progress.nextLabel}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Successful projects — {data.progress.projects} / {data.progress.projectsTarget}</p>
              <div className="h-2 rounded-full bg-slate-800/70 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${data.progress.projectsTarget ? Math.min(100, (data.progress.projects / data.progress.projectsTarget) * 100) : 0}%` }} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Attributed revenue — {money(data.progress.revenue)} / {money(data.progress.revenueTarget)}</p>
              <div className="h-2 rounded-full bg-slate-800/70 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${data.progress.revenueTarget ? Math.min(100, (data.progress.revenue / data.progress.revenueTarget) * 100) : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {data.tiers.map((tier) => {
          const isCurrent = tier.key === data.currentRank;
          return (
            <div key={tier.key} className={`rounded-2xl p-5 border ${isCurrent ? "border-cyan-500/40 bg-cyan-500/5" : "border-slate-800/60 bg-slate-950/40"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${rankColorClass(tier.key)}`}>{tier.label}</span>
                {tier.achieved ? <Check className="w-4 h-4 text-green-400" aria-hidden="true" /> : tier.isAutomatic ? <span className="w-4 h-4" /> : <Lock className="w-4 h-4 text-slate-600" aria-hidden="true" />}
              </div>
              <p className="text-xs text-slate-400">
                {tier.isAutomatic ? (
                  <>
                    {tier.minProjects === 0 && tier.minRevenue === 0 ? "Entry rank" : `${tier.minProjects} projects or ${money(tier.minRevenue)}`}
                  </>
                ) : (
                  "By invitation"
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
        <div className="p-5 border-b border-slate-800/50">
          <h2 className="text-sm font-semibold text-white">Rank history</h2>
        </div>
        {data.history.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No rank changes yet. Your progression will appear here.</div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {data.history.map((h) => (
              <div key={h.id} className="p-4 flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${rankColorClass(h.previousRank)}`}>{h.previousRank}</span>
                  <span className="text-slate-500">→</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${rankColorClass(h.newRank)}`}>{h.newRank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {h.reason && <p className="text-xs text-slate-400 truncate">{h.reason}</p>}
                  <p className="text-[11px] text-slate-600">{new Date(h.createdAt).toLocaleDateString()} · by {h.actor}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
