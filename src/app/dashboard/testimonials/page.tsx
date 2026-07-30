"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  rating: number;
  imageUrl: string | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    name: "", role: "", company: "", quote: "", rating: 5, imageUrl: "", featured: false, sortOrder: 0,
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) { const data = await res.json(); setItems(data); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchItems(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name, role: t.role || "", company: t.company || "", quote: t.quote,
      rating: t.rating, imageUrl: t.imageUrl || "", featured: t.featured, sortOrder: t.sortOrder,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", role: "", company: "", quote: "", rating: 5, imageUrl: "", featured: false, sortOrder: 0 });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/testimonials", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      if (res.ok) { resetForm(); fetchItems(); }
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Deactivate this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) { console.error(err); }
  };

  const toggleField = async (id: number, field: string, value: boolean) => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !value }),
      });
      if (res.ok) fetchItems();
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Testimonials</h1>
            <p className="text-sm text-slate-400">Manage reviews and quotes shown on the site.</p>
          </div>
          <button onClick={() => { if (editing) resetForm(); else setShowForm(!showForm); }} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Testimonial"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              <input placeholder="Role (e.g. CEO)" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
              <input type="number" min={1} max={5} placeholder="Rating (1-5)" value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50" />
            <textarea required rows={3} placeholder="Quote" value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded bg-slate-900 border-slate-800" /> Featured</label>
              <input type="number" placeholder="Sort Order" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm w-24" />
            </div>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">{editing ? "Update Testimonial" : "Save Testimonial"}</button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading testimonials...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No testimonials yet.</div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {items.map(t => (
              <div key={t.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${t.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{t.isActive ? "Active" : "Inactive"}</span>
                    {t.featured && <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Featured</span>}
                    <span className="flex items-center gap-0.5 text-yellow-400 text-xs"><Star className="w-3 h-3 fill-yellow-400" /> {t.rating}</span>
                  </div>
                  <p className="text-xs text-slate-400">{t.role}{t.role && t.company ? " · " : ""}{t.company}</p>
                  <p className="text-xs text-slate-500 mt-1 italic">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleField(t.id, "isActive", t.isActive)} aria-label={`${t.isActive ? "Deactivate" : "Activate"} testimonial from ${t.name}`} className={`p-1.5 rounded-lg transition-colors ${t.isActive ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"}`}><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => openEdit(t)} aria-label={`Edit testimonial from ${t.name}`} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><Star className="w-4 h-4" /></button>
                  <button onClick={() => deleteItem(t.id)} aria-label={`Deactivate testimonial from ${t.name}`} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
