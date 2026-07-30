"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle } from "lucide-react";

interface Member {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function TeamPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", twitterUrl: "", sortOrder: 0 });

  const fetchItems = async () => {
    try { const res = await fetch("/api/team"); if (res.ok) { const data = await res.json(); setItems(data); } }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchItems(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, bio: m.bio || "", imageUrl: m.imageUrl || "", linkedinUrl: m.linkedinUrl || "", twitterUrl: m.twitterUrl || "", sortOrder: m.sortOrder });
    setShowForm(true);
  };

  const resetForm = () => { setEditing(null); setForm({ name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", twitterUrl: "", sortOrder: 0 }); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/team", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
      if (res.ok) { resetForm(); fetchItems(); }
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (id: number) => { if (!confirm("Deactivate this member?")) return; try { const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" }); if (res.ok) fetchItems(); } catch (err) { console.error(err); } };
  const toggleActive = async (id: number, active: boolean) => { try { const res = await fetch("/api/team", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !active }) }); if (res.ok) fetchItems(); } catch (err) { console.error(err); } };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white mb-1">Team</h1><p className="text-sm text-slate-400">Manage team members displayed on the site.</p></div>
          <button onClick={() => { if (editing) resetForm(); else setShowForm(!showForm); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"><Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Member"}</button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              <input required placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              <input placeholder="Twitter/X URL" value={form.twitterUrl} onChange={e => setForm({ ...form, twitterUrl: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <textarea placeholder="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
            <input type="number" placeholder="Sort Order" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm w-24" />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">{editing ? "Update Member" : "Save Member"}</button>
          </form>
        )}

        {loading ? <div className="text-center py-12 text-sm text-slate-500">Loading team...</div> : items.length === 0 ? <div className="text-center py-12 text-sm text-slate-500">No team members yet.</div> : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {items.map(m => (
              <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${m.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{m.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.role} · Order {m.sortOrder}</p>
                  {m.bio && <p className="text-xs text-slate-500 mt-1">{m.bio}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(m.id, m.isActive)} aria-label={`${m.isActive ? "Deactivate" : "Activate"} ${m.name}`} className={`p-1.5 rounded-lg transition-colors ${m.isActive ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"}`}><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium">Edit</button>
                  <button onClick={() => deleteItem(m.id)} aria-label={`Deactivate ${m.name}`} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
