"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, DollarSign, FolderOpen, Handshake, TrendingUp } from "lucide-react";
import { rankColorClass, rankLabel } from "@/lib/partner-constants";

interface Overview {
  partner: { id: string; name: string; email: string; rank: string; commissionRate: number; joinDate: string; status: string };
  agreementSigned: boolean;
  stats: {
    totalReferrals: number;
    activeReferrals: number;
    wonProjects: number;
    attributedRevenue: number;
    commissionEarned: number;
    commissionPaid: number;
    commissionPending: number;
  };
  progress: { nextKey: string; nextLabel: string; projects: number; projectsTarget: number; revenue: number; revenueTarget: number } | null;
  recentReferrals: Array<{ referralId: string; businessName: string; status: string; createdAt: string }>;
  recentCommissions: Array<{ projectName: string; commissionAmount: number; status: string; createdAt: string }>;
  documents: Array<{ documentId: string; type: string; rank: string | null; issueDate: string; status: string }>;
}

const REFERRAL_BADGE: Record<string, string> = {
  submitted: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  under_review: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  contacted: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  discovery: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  proposal: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  negotiation: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
  won: "bg-green-500/10 text-green-300 border-green-500/25",
  lost: "bg-red-500/10 text-red-300 border-red-500/25",
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function PartnerDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/overview");
        if (res.ok) setData(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading dashboard…</div>;
  }
  if (!data) {
    return <div className="p-8 text-center text-sm text-slate-500">Could not load your dashboard.</div>;
  }

  const p = data.partner;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome, {p.name.split(" ")[0]}</h1>
          <p className="text-sm text-slate-400">
            Partner ID <span className="text-cyan-300 font-mono">{p.id}</span> · Joined {new Date(p.joinDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${rankColorClass(p.rank)}`}>
            {rankLabel(p.rank)} Partner
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/60 bg-slate-950/40 text-slate-300">
            {Math.round(p.commissionRate * 100)}% commission
          </span>
        </div>
      </div>

      {/* Rank progress */}
      {data.progress && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" aria-hidden="true" /> Progress to {data.progress.nextLabel}
            </h2>
            <span className="text-xs text-slate-400">
              {data.progress.projects} / {data.progress.projectsTarget} projects · {money(data.progress.revenue)} / {money(data.progress.revenueTarget)} revenue
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Successful projects</span>
                <span>{data.progress.projectsTarget === 0 ? "—" : `${Math.round((data.progress.projects / data.progress.projectsTarget) * 100)}%`}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/70 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all" style={{ width: `${data.progress.projectsTarget === 0 ? 0 : Math.min(100, (data.progress.projects / data.progress.projectsTarget) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Attributed revenue</span>
                <span>{data.progress.revenueTarget === 0 ? "—" : `${Math.round((data.progress.revenue / data.progress.revenueTarget) * 100)}%`}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/70 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${data.progress.revenueTarget === 0 ? 0 : Math.min(100, (data.progress.revenue / data.progress.revenueTarget) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: "Total referrals", value: data.stats.totalReferrals, icon: Handshake, color: "text-white" },
          { label: "Active deals", value: data.stats.activeReferrals, icon: TrendingUp, color: "text-cyan-400" },
          { label: "Won projects", value: data.stats.wonProjects, icon: Award, color: "text-green-400" },
          { label: "Attributed revenue", value: money(data.stats.attributedRevenue), icon: DollarSign, color: "text-purple-400" },
          { label: "Commission earned", value: money(data.stats.commissionEarned), icon: DollarSign, color: "text-cyan-400" },
          { label: "Commission paid", value: money(data.stats.commissionPaid), icon: FolderOpen, color: "text-green-400" },
          { label: "Commission pending", value: money(data.stats.commissionPending), icon: FolderOpen, color: "text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} aria-hidden="true" />
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent referrals */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent referrals</h2>
            <Link href="/partner/referrals" className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentReferrals.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No referrals yet. Submit your first introduction.</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {data.recentReferrals.map((r) => (
                <div key={r.referralId} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.businessName}</p>
                    <p className="text-xs text-slate-500 font-mono">{r.referralId}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${REFERRAL_BADGE[r.status] || REFERRAL_BADGE.submitted}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent commissions */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent commissions</h2>
            <Link href="/partner/commissions" className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentCommissions.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">No commissions yet. They appear once a referred project is paid.</div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {data.recentCommissions.map((c, i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white truncate">{c.projectName}</p>
                  <span className="text-sm font-semibold text-cyan-300">{money(c.commissionAmount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/partner/referrals", label: "Submit a referral", desc: "Introduce a prospective client", icon: Handshake },
          { href: "/partner/documents", label: "My documents", desc: "Joining letter & certificates", icon: FolderOpen },
          { href: "/partner/rank", label: "Rank & achievements", desc: "Track your progression", icon: Award },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="group flex items-start gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
              <action.icon className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{action.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
