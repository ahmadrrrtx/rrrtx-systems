"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Handshake, Inbox, Target, TrendingUp, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface OverviewData {
  metrics: {
    totalPartners: number;
    activePartners: number;
    pendingApplications: number;
    activeReferrals: number;
    wonProjects: number;
    attributedRevenue: number;
    commissionsPayable: number;
    commissionsPaid: number;
  };
  recentApplications: Array<{ id: number; applicationId: string; name: string; email: string; country: string | null; status: string; createdAt: string }>;
}

const APP_BADGE: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  under_review: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  approved: "bg-green-500/10 text-green-300 border-green-500/25",
  rejected: "bg-red-500/10 text-red-300 border-red-500/25",
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export default function PartnersOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/admin/overview");
        if (res.ok) setData(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Partner Network</h1>
          <p className="text-sm text-slate-400">Applications, partners, referrals, and commissions.</p>
        </div>

        {loading || !data ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total partners", value: data.metrics.totalPartners, icon: Users, color: "text-white" },
                { label: "Active partners", value: data.metrics.activePartners, icon: Handshake, color: "text-cyan-400" },
                { label: "Pending applications", value: data.metrics.pendingApplications, icon: Inbox, color: "text-yellow-400" },
                { label: "Active referrals", value: data.metrics.activeReferrals, icon: Target, color: "text-purple-400" },
                { label: "Won projects", value: data.metrics.wonProjects, icon: TrendingUp, color: "text-green-400" },
                { label: "Attributed revenue", value: money(data.metrics.attributedRevenue), icon: DollarSign, color: "text-blue-400" },
                { label: "Commissions payable", value: money(data.metrics.commissionsPayable), icon: DollarSign, color: "text-yellow-400" },
                { label: "Commissions paid", value: money(data.metrics.commissionsPaid), icon: DollarSign, color: "text-green-400" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/dashboard/partners/applications", label: "Review applications", desc: "Approve or reject new partners", icon: Inbox },
                { href: "/dashboard/partners/partners", label: "Manage partners", desc: "Status, ranks, and rates", icon: Users },
                { href: "/dashboard/partners/referrals", label: "Referrals", desc: "Update deal status", icon: Target },
                { href: "/dashboard/partners/commissions", label: "Commissions", desc: "Record and pay out", icon: DollarSign },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="group flex items-start gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <action.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{action.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
              <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Recent applications</h2>
                <Link href="/dashboard/partners/applications" className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {data.recentApplications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">No applications yet.</div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {data.recentApplications.map((a) => (
                    <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{a.name} {a.country && <span className="text-slate-500">· {a.country}</span>}</p>
                        <p className="text-xs text-slate-500 font-mono">{a.applicationId} · {a.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${APP_BADGE[a.status] || APP_BADGE.pending}`}>
                        {a.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
