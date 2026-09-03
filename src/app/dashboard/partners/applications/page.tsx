"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Inbox, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Application {
  id: number;
  applicationId: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  role: string | null;
  company: string | null;
  website: string | null;
  linkedin: string | null;
  experience: string | null;
  referralBackground: string | null;
  whyPartner: string | null;
  howRefer: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

const BADGE: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  under_review: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
  approved: "bg-green-500/10 text-green-300 border-green-500/25",
  rejected: "bg-red-500/10 text-red-300 border-red-500/25",
};

export default function PartnerApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const fetchApps = async () => {
    try {
      const res = await fetch(`/api/partner/admin/applications${filter ? `?status=${filter}` : ""}`);
      if (res.ok) setApps(await res.json());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchApps(); }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const act = async (id: number, status: string) => {
    setBusy(id);
    setNotice("");
    try {
      const res = await fetch("/api/partner/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        if (status === "approved" && data.setupCode) {
          setNotice(`Approved. Partner ID ${data.partnerId} — setup code: ${data.setupCode} (share with the partner once).`);
        } else if (!res.ok) {
          setNotice(data.error || "Update failed");
        }
        await fetchApps();
      } else {
        setNotice(data.error || "Update failed");
      }
    } catch {
      setNotice("Network error.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Partner applications</h1>
            <p className="text-sm text-slate-400">Review, approve, or reject applications.</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {notice && (
          <div className="px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-200 break-words" role="status">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading…</div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-slate-800/50 bg-slate-950/40">
            <Inbox className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No applications match this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-semibold text-white">{app.name}</h2>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${BADGE[app.status] || BADGE.pending}`}>
                          {app.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span>{app.email}</span>
                        {app.country && <span>{app.country}</span>}
                        {app.role && <span>{app.role}</span>}
                        {app.company && <span>· {app.company}</span>}
                        <span className="font-mono">{app.applicationId}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setExpanded(expanded === app.id ? null : app.id)} className="px-3 py-1.5 rounded-lg text-xs border border-slate-700/70 bg-slate-900/60 text-slate-300 hover:border-slate-600">
                        {expanded === app.id ? "Hide" : "Details"}
                      </button>
                      {app.status !== "approved" && (
                        <>
                          <button
                            type="button"
                            disabled={busy === app.id}
                            onClick={() => act(app.id, "under_review")}
                            className="px-3 py-1.5 rounded-lg text-xs border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/15 disabled:opacity-50"
                          >
                            Review
                          </button>
                          <button
                            type="button"
                            disabled={busy === app.id}
                            onClick={() => act(app.id, "approved")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/20 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy === app.id}
                            onClick={() => act(app.id, "rejected")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/15 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {expanded === app.id && (
                  <div className="px-5 pb-5 border-t border-slate-800/50 pt-4 grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Why partner</p>
                      <p className="text-slate-300 leading-relaxed">{app.whyPartner || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">How they will refer</p>
                      <p className="text-slate-300 leading-relaxed">{app.howRefer || "—"}</p>
                    </div>
                    {app.referralBackground && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Referral background</p>
                        <p className="text-slate-300 leading-relaxed">{app.referralBackground}</p>
                      </div>
                    )}
                    {app.experience && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Experience</p>
                        <p className="text-slate-300 leading-relaxed">{app.experience}</p>
                      </div>
                    )}
                    {(app.website || app.linkedin) && (
                      <div className="sm:col-span-2 flex flex-wrap gap-4 text-xs">
                        {app.website && <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">Website ↗</a>}
                        {app.linkedin && <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">LinkedIn ↗</a>}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
