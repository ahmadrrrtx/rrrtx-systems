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

const statusOptions = ["new", "contacted", "qualified", "proposal", "closed", "lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

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

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "all" || lead.status === filter;
    const matchesSearch =
      search === "" ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Leads</h1>
            <p className="text-sm text-slate-400">Manage all inbound leads and service requests.</p>
          </div>
          <div className="text-sm text-slate-400">
            {filteredLeads.length} of {leads.length} leads
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", ...statusOptions].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all border ${
                  filter === status
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                {search || filter !== "all" ? "No leads match your filters." : "No leads yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredLeads.map((lead) => (
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
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {lead.email}
                        </span>
                        {lead.company && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {lead.company}
                          </span>
                        )}
                        {lead.service && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Filter className="w-3 h-3" /> {lead.service}
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
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors border border-cyan-500/20"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      >
                        {expanded === lead.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
