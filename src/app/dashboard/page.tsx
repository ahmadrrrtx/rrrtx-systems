"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Inbox,
  Mail,
  Calendar,
  Tag,
  DollarSign,
  MessageSquare,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  FolderOpen,
  Layers,
  Image,
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  closed: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchLeads(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    proposal: leads.filter((l) => l.status === "proposal").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  const recentLeads = leads.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400">Overview of your leads and activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Leads", value: stats.total, icon: Inbox, color: "text-white" },
            { label: "New", value: stats.new, icon: Mail, color: "text-cyan-400" },
            { label: "Contacted", value: stats.contacted, icon: MessageSquare, color: "text-yellow-400" },
            { label: "Qualified", value: stats.qualified, icon: Filter, color: "text-purple-400" },
            { label: "Proposal", value: stats.proposal, icon: TrendingUp, color: "text-blue-400" },
            { label: "Closed", value: stats.closed, icon: CheckCircle, color: "text-green-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50"
            >
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

        {/* Recent Leads */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
            <Link
              href="/dashboard/leads"
              className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading leads...</div>
          ) : recentLeads.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No leads yet. Submit a test via the contact form.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{lead.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                            statusColors[lead.status] || statusColors.new
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {lead.email}
                        </span>
                        {lead.service && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Tag className="w-3 h-3" /> {lead.service}
                          </span>
                        )}
                        {lead.budget && (
                          <span className="flex items-center gap-1 text-purple-400">
                            <DollarSign className="w-3 h-3" /> {lead.budget}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors self-start sm:self-center"
                    >
                      {expanded === lead.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {expanded === lead.id && lead.message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-slate-800/50"
                    >
                      <p className="text-sm text-slate-400">{lead.message}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/dashboard/leads", label: "Manage Leads", desc: "View & update all inbound leads", icon: Inbox },
            { href: "/dashboard/projects", label: "Portfolio Manager", desc: "Add or edit case studies", icon: FolderOpen },
            { href: "/dashboard/services", label: "Services Editor", desc: "Update service offerings", icon: Layers },
            { href: "/dashboard/assets", label: "Asset Manager", desc: "GitHub-linked file management", icon: Image },
          ].map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={action.href}
                className="group flex items-start gap-3 p-4 rounded-xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <action.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {action.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{action.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
