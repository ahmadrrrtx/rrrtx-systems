"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, ExternalLink } from "lucide-react";

interface Bundle {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  githubUrl: string | null;
  price: number | null;
  isActive: boolean;
}

export default function PromptBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    githubUrl: "",
    price: "",
  });

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const res = await fetch("/api/prompt-bundles");
      if (res.ok) {
        const data = await res.json();
        setBundles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/prompt-bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseInt(formData.price) : null,
        }),
      });
      if (res.ok) {
        setFormData({ title: "", description: "", category: "", githubUrl: "", price: "" });
        setShowForm(false);
        fetchBundles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBundle = async (id: number) => {
    if (!confirm("Delete this bundle?")) return;
    try {
      const res = await fetch(`/api/prompt-bundles?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchBundles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Prompt Bundles Manager</h1>
            <p className="text-sm text-slate-400">Internal products and upsells for existing clients.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Bundle"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4"
          >
            <input
              placeholder="Bundle Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <input
                placeholder="Price (USD)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <input
              placeholder="GitHub URL (optional)"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Save Bundle
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading bundles...</div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No prompt bundles yet.</div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {bundles.map((bundle) => (
              <div key={bundle.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{bundle.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                      bundle.isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {bundle.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{bundle.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {bundle.category && <span className="text-cyan-400">{bundle.category}</span>}
                    {bundle.price !== null && <span className="text-purple-400">${bundle.price}</span>}
                    {bundle.githubUrl && (
                      <a
                        href={bundle.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> GitHub
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteBundle(bundle.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
