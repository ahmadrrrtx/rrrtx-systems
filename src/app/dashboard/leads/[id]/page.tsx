"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowLeft, Calendar, Save, CheckCircle, Mail, Tag, DollarSign, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Lead {
  id: number; name: string; email: string; company: string | null; service: string | null;
  budget: string | null; message: string | null; status: string; createdAt: string; updatedAt: string;
}

interface Note {
  id: number; leadId: number; note: string; followUpDate: string | null; createdAt: string;
}

const statusOptions = ["new","contacted","qualified","proposal","closed","lost"];
const statusColors: Record<string, string> = {
  new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  proposal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  closed: "bg-green-500/10 text-green-400 border-green-500/20",
  lost: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchLead(); }, [id]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) { const data = await res.json(); setLead(data.lead); setNotes(data.notes || []); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      if (res.ok) { setLead(prev => prev ? { ...prev, status } : prev); }
    } catch (err) { console.error(err); }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: noteText, followUpDate: followUpDate || null }) });
      if (res.ok) { setNoteText(""); setFollowUpDate(""); fetchLead(); }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout><div className="p-8 text-center text-sm text-slate-500">Loading lead...</div></DashboardLayout>;
  if (!lead) return <DashboardLayout><div className="p-8 text-center text-sm text-slate-500">Lead not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/leads" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Leads</Link>
        </div>

        <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{lead.name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>
                {lead.company && <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {lead.company}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider border ${statusColors[lead.status] || statusColors.new}`}>{lead.status}</span>
              <select value={lead.status} onChange={e => updateStatus(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500/50">
                {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"><div className="text-xs text-slate-500 mb-1">Service</div><div className="text-slate-200">{lead.service || "—"}</div></div>
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"><div className="text-xs text-slate-500 mb-1">Budget</div><div className="text-slate-200">{lead.budget || "—"}</div></div>
            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"><div className="text-xs text-slate-500 mb-1">Date</div><div className="text-slate-200">{new Date(lead.createdAt).toLocaleDateString()}</div></div>
          </div>

          {lead.message && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2"><MessageSquare className="w-3.5 h-3.5" /> Message</div>
              <p className="text-sm text-slate-300 whitespace-pre-line">{lead.message}</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
          <h2 className="text-sm font-semibold text-white">Notes & Follow-ups</h2>
          <form onSubmit={addNote} className="space-y-3">
            <textarea required rows={3} placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-500" /><input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50" /></div>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Add Note"}</button>
            </div>
          </form>

          <div className="space-y-3">
            {notes.length === 0 ? <p className="text-sm text-slate-500">No notes yet.</p> : notes.map(n => (
              <div key={n.id} className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
                <p className="text-sm text-slate-300 whitespace-pre-line">{n.note}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  {n.followUpDate && <span className="flex items-center gap-1 text-yellow-400"><Calendar className="w-3 h-3" /> Follow-up: {new Date(n.followUpDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
