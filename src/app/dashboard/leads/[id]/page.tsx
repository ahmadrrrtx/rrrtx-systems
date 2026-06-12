"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Tag,
  DollarSign,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
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

interface LeadNote {
  id: number;
  leadId: number;
  note: string;
  followUpDate: string | null;
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

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = parseInt(params.id as string);

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    fetchLead();
    fetchNotes();
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok && lead) {
        setLead({ ...lead, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: newNote,
          followUpDate: followUpDate || null,
        }),
      });
      if (res.ok) {
        setNewNote("");
        setFollowUpDate("");
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-slate-500">Loading lead...</div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-slate-500">Lead not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Leads
          </Link>
        </div>

        {/* Lead Card */}
        <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{lead.name}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                {lead.email}
                {lead.company && (
                  <>
                    <span className="mx-1">·</span>
                    <Tag className="w-3.5 h-3.5" />
                    {lead.company}
                  </>
                )}
              </div>
            </div>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border bg-transparent cursor-pointer ${
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

          <div className="flex flex-wrap gap-3 text-sm">
            {lead.service && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 text-xs">
                <MessageSquare className="w-3 h-3" /> {lead.service}
              </span>
            )}
            {lead.budget && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-purple-400 text-xs">
                <DollarSign className="w-3 h-3" /> {lead.budget}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              <Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </div>

          {lead.message && (
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <p className="text-sm text-slate-300 leading-relaxed">{lead.message}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Notes & Follow-ups</h2>

          {/* Add Note */}
          <div className="p-4 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-3">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this lead..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <button
                onClick={addNote}
                disabled={saving || !newNote.trim()}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Add Note"}
              </button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">
                No notes yet. Add your first note above.
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border border-slate-800/50 bg-slate-950/40"
                >
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">{note.note}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.followUpDate && (
                      <span className="inline-flex items-center gap-1 text-yellow-400">
                        <Clock className="w-3 h-3" /> Follow-up: {new Date(note.followUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
