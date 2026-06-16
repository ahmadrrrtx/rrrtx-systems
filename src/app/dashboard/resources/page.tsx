"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle, FileText, Download, Lock, Unlock } from "lucide-react";

interface ResourceItem {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  category: string;
  fileType: string;
  downloadUrl: string;
  isGated: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function ResourcesDashboardPage() {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ResourceItem | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    category: "Guide",
    fileType: "PDF",
    downloadUrl: "",
    isGated: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/resources?all=true");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (res: ResourceItem) => {
    setEditing(res);
    setForm({
      title: res.title,
      description: res.description || "",
      coverImageUrl: res.coverImageUrl || "",
      category: res.category,
      fileType: res.fileType,
      downloadUrl: res.downloadUrl,
      isGated: res.isGated,
      sortOrder: res.sortOrder,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      coverImageUrl: "",
      category: "Guide",
      fileType: "PDF",
      downloadUrl: "",
      isGated: true,
      sortOrder: 0,
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/resources", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      if (res.ok) {
        resetForm();
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this downloadable asset?")) return;
    try {
      const res = await fetch(`/api/resources?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id: number, field: "isActive" | "isGated", currentValue: boolean) => {
    try {
      const res = await fetch("/api/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !currentValue }),
      });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Resource Downloads</h1>
            <p className="text-sm text-slate-400">Manage downloadable PDFs, checklists, templates, and gated lead magnets.</p>
          </div>
          <button
            onClick={() => (editing ? resetForm() : setShowForm(!showForm))}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Resource"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resource Title</label>
                <input
                  required
                  placeholder="e.g. Website Launch Checklist"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Download Link / URL</label>
                <input
                  required
                  placeholder="e.g. https://yourbrand.com/assets/file.pdf"
                  value={form.downloadUrl}
                  onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Guide">Guide</option>
                  <option value="Checklist">Checklist</option>
                  <option value="Template">Template</option>
                  <option value="Audit Sheet">Audit Sheet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">File Format Type</label>
                <select
                  value={form.fileType}
                  onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="PDF">PDF</option>
                  <option value="XLSX">XLSX (Excel)</option>
                  <option value="ZIP">ZIP</option>
                  <option value="DOCX">DOCX (Word)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gated Lead Access</label>
                <select
                  value={form.isGated ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, isGated: e.target.value === "true" })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                >
                  <option value="true">Gated (Requires Lead Info)</option>
                  <option value="false">Ungated (Direct Download)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                placeholder="Give a brief summary of what this asset helps users achieve..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Thumbnail/Cover Image URL (optional)</label>
              <input
                placeholder="e.g. https://yourbrand.com/assets/cover.png"
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button type="submit" className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all">{editing ? "Update Asset" : "Save Asset"}</button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading resources...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No resources published yet.</div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${item.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{item.isActive ? "Active" : "Hidden"}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border inline-flex items-center gap-1 ${item.isGated ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}>
                      {item.isGated ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />} {item.isGated ? "Gated" : "Ungated"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {item.category} ({item.fileType})</span>
                    <span className="flex items-center gap-1 truncate max-w-sm"><Download className="w-3.5 h-3.5" /> {item.downloadUrl}</span>
                    <span className="text-[10px] text-slate-500">Order: {item.sortOrder}</span>
                  </div>
                  {item.description && <p className="text-xs text-slate-500 mt-2 truncate max-w-xl">{item.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleStatus(item.id, "isActive", item.isActive)} className={`p-1.5 rounded-lg transition-colors ${item.isActive ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"}`}><CheckCircle className="w-4 h-4" /></button>
                  <button onClick={() => toggleStatus(item.id, "isGated", item.isGated)} className={`p-1.5 rounded-lg transition-colors ${item.isGated ? "text-purple-400 hover:bg-purple-500/10" : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"}`}>{item.isGated ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}</button>
                  <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all">Edit</button>
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
