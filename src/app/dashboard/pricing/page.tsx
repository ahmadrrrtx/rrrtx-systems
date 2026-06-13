"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle } from "lucide-react";

interface Tier {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  startingPrice: string | null;
  description: string | null;
  features: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function PricingPage() {
  const [items, setItems] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tier | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", subtitle: "", startingPrice: "", description: "", features: "", sortOrder: 0 });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    try { const res = await fetch("/api/pricing"); if (res.ok) { const data = await res.json(); setItems(data); } }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openEdit = (t: Tier) => {
    setEditing(t);
    setForm({ slug: t.slug, title: t.title, subtitle: t.subtitle || "", startingPrice: t.startingPrice || "", description: t.description || "", features: t.features || "", sortOrder: t.sortOrder });
    setShowForm(true);
  };

  const resetForm = () => { setEditing(null); setForm({ slug: "", title: "", subtitle: "", startingPrice: "", description: "", features: "", sortOrder: 0 }); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/pricing", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { id: editing.id, ...form } : form) });
      if (res.ok) { resetForm(); fetchItems(); }
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (id: number) => { if (!confirm("Delete this tier?")) return; try { const res = await fetch(`/api/pricing?id=${id}`, { method: "DELETE" }); if (res.ok) fetchItems(); } catch (err) { console.error(err); } };
  const toggleActive = async (id: number, active: boolean) => { try { const res = await fetch("/api/pricing", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !active }) }); if (res.ok) fetchItems(); } catch (err) { console.error(err); } };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-white mb-1">Pricing Editor</h1><p className="text-sm text-slate-400">Manage pricing tiers displayed on the site.</p></div>
          <button onClick={() => { editing ? resetForm() : setShowForm(!showForm); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"><Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Tier"}</button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <input placeholder="Subtitle (e.g. Best for startups)" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            <input placeholder="Starting Price (e.g. $10,000)" value={form.startingPrice} onChange={e => setForm({ ...form, startingPrice: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
            <textarea placeholder="Features (comma-separated)" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
            <input type="number" placeholder="Sort Order" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm w-24" />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">{editing ? "Update Tier" : "Save Tier"}</button>
          </form>
        )}

        {loading ? <div className="text-center py-12 text-sm text-slate-500">Loading pricing...</div> : items.length === 0 ? <div className="text-center py-12 text-sm text-slate-500">No pricing tiers yet. Add your first tier.</div> : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {items.map(t => (
              <div key={t.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${t.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{t.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <p className="text-xs text-slate-400">/{t.slug} · {t.startingPrice} · Order {t.sortOrder}</p>
                  {t.description && <p className="text-xs text-slate-500 mt-1">{t.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(t.id, t.isActive)} className={`p-1.5 rounded-lg transition-colors ${t.isActive ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"}`}><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium">Edit</button>
                  <button onClick={() => deleteItem(t.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
