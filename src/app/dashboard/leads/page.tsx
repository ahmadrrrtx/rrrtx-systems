"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import {
  Search,
  Filter,
  Mail,
  Calendar,
  Tag,
  DollarSign,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Inbox,
  Sparkles,
  BarChart,
  RefreshCw,
  FileText,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
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

interface AuditLead {
  id: number;
  name: string;
  email: string;
  websiteUrl: string;
  businessType: string;
  helpWith: string;
  scores: string; // JSON string
  recommendations: string; // JSON string
  createdAt: string;
}

interface ROILead {
  id: number;
  name: string | null;
  email: string | null;
  monthlyLeads: number;
  conversionRate: number;
  averageValue: number;
  results: string; // JSON string
  createdAt: string;
}

interface GatedLead {
  id: number;
  name: string;
  email: string;
  resourceTitle: string | null;
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

const statusOptions = ["new", "contacted", "qualified", "proposal", "closed", "lost"];

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<"inbound" | "audit" | "roi" | "gated">("inbound");
  
  // 4 lists for different leads
  const [inboundLeads, setInboundLeads] = useState<Lead[]>([]);
  const [auditLeads, setAuditLeads] = useState<AuditLead[]>([]);
  const [roiLeads, setRoiLeads] = useState<ROILead[]>([]);
  const [gatedLeads, setGatedLeads] = useState<GatedLead[]>([]);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [activeTab]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      if (activeTab === "inbound") {
        const res = await fetch("/api/leads");
        if (res.ok) setInboundLeads(await res.json());
      } else if (activeTab === "audit") {
        const res = await fetch("/api/audit");
        if (res.ok) setAuditLeads(await res.json());
      } else if (activeTab === "roi") {
        const res = await fetch("/api/calculator");
        if (res.ok) setRoiLeads(await res.json());
      } else if (activeTab === "gated") {
        const res = await fetch("/api/resources/download?all=true");
        if (res.ok) setGatedLeads(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInboundLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Leads & Submissions</h1>
            <p className="text-sm text-slate-400">Track contact inquiries, audit results, ROI metrics, and gated library downloads.</p>
          </div>
        </div>

        {/* Dynamic subpages tabs */}
        <div className="flex border-b border-slate-800/60 overflow-x-auto gap-2">
          {[
            { id: "inbound", label: "Inbound Inquiries" },
            { id: "audit", label: "Audit Requests" },
            { id: "roi", label: "ROI Calculations" },
            { id: "gated", label: "Gated Downloads" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setFilter("all");
                setSearch("");
                setExpanded(null);
              }}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lead Table content view */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading leads...</div>
          ) : activeTab === "inbound" ? (
            // Tab 1: Inbound Contact Leads
            inboundLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No inquiries found yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {inboundLeads.map((lead) => (
                  <div key={lead.id} className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-semibold text-white">{lead.name}</h3>
                          <select
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border bg-transparent cursor-pointer ${
                              statusColors[lead.status] || statusColors.new
                            }`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s} className="bg-slate-900 text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          {lead.company && <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {lead.company}</span>}
                          {lead.service && <span className="flex items-center gap-1 text-cyan-400"><Filter className="w-3 h-3" /> {lead.service}</span>}
                          {lead.budget && <span className="flex items-center gap-1 text-purple-400"><DollarSign className="w-3 h-3" /> {lead.budget}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                          {expanded === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {expanded === lead.id && lead.message && (
                      <div className="mt-3 pt-3 border-t border-slate-800/50 text-sm text-slate-400">
                        {lead.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : activeTab === "audit" ? (
            // Tab 2: Audit requests
            auditLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No audit requests submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {auditLeads.map((lead) => {
                  let parsedScores = { websiteClarity: 0, performanceUX: 0, conversionCapture: 0 };
                  try { parsedScores = JSON.parse(lead.scores); } catch {}
                  return (
                    <div key={lead.id} className="p-4 sm:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white mb-2">{lead.name} · <span className="text-cyan-400">{lead.websiteUrl}</span></h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {lead.businessType || "N/A"}</span>
                            <span className="flex items-center gap-1 text-purple-400"><FileText className="w-3 h-3" /> {lead.helpWith || "N/A"}</span>
                            <span className="flex items-center gap-1 text-green-400">
                              <Sparkles className="w-3 h-3" /> Clarity: {parsedScores.websiteClarity}/10 · Perf: {parsedScores.performanceUX}/10 · Conv: {parsedScores.conversionCapture}/10
                            </span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                        >
                          {expanded === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {expanded === lead.id && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50 space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recommendations Prepared:</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {JSON.parse(lead.recommendations || "[]").map((rec: any, idx: number) => (
                              <div key={idx} className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs">
                                <span className="font-bold text-cyan-400 block">{rec.area} (Score: {rec.score}/10)</span>
                                <span className="text-slate-400 block mt-1">{rec.critique}</span>
                                <span className="text-cyan-300 block mt-1.5 italic"><strong>Fix:</strong> {rec.fix}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === "roi" ? (
            // Tab 3: ROI calculations
            roiLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No ROI submissions yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {roiLeads.map((lead) => {
                  let parsedRes = { annualImpact: 0, timeSavings: 0, roiUplift: 0 };
                  try { parsedRes = JSON.parse(lead.results); } catch {}
                  return (
                    <div key={lead.id} className="p-4 sm:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white mb-2">{lead.name || "Anonymous Lead"}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                            {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>}
                            <span className="flex items-center gap-1 text-green-400"><DollarSign className="w-3 h-3" /> Annual Impact: +${parsedRes.annualImpact.toLocaleString()}</span>
                            <span className="flex items-center gap-1 text-cyan-400"><TrendingUp className="w-3 h-3" /> Monthly Gain: +${parsedRes.roiUplift.toLocaleString()}</span>
                            <span className="flex items-center gap-1 text-purple-400"><RefreshCw className="w-3 h-3" /> Time Saved: {parsedRes.timeSavings} Hours</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // Tab 4: Gated library downloads
            gatedLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No resources downloaded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {gatedLeads.map((lead) => (
                  <div key={lead.id} className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white mb-1">{lead.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                          <span className="flex items-center gap-1 text-cyan-400"><FileText className="w-3.5 h-3.5" /> Downloaded: {lead.resourceTitle || "Custom Asset"}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
