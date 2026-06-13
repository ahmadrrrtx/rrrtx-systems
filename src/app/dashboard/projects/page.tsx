"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ExternalLink, CheckCircle, XCircle, Edit, Trash, Plus, Pencil } from "lucide-react";

interface Project {
  id: number;
  slug: string;
  clientName: string | null;
  industry: string | null;
  title: string;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  metrics: string | null;
  imageUrl: string | null;
  featured: boolean;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    clientName: "",
    industry: "",
    challenge: "",
    solution: "",
    results: "",
    imageUrl: "",
    featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setFormData({
      slug: p.slug,
      title: p.title,
      clientName: p.clientName || "",
      industry: p.industry || "",
      challenge: p.challenge || "",
      solution: p.solution || "",
      results: p.results || "",
      imageUrl: p.imageUrl || "",
      featured: p.featured ?? false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ slug: "", title: "", clientName: "", industry: "", challenge: "", solution: "", results: "", imageUrl: "", featured: false });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...formData } : formData),
      });
      if (res.ok) {
        resetForm();
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: !featured }),
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Portfolio Manager</h1>
            <p className="text-sm text-slate-400">Add, edit, or remove case studies.</p>
          </div>
          <button
            onClick={() => { editing ? resetForm() : setShowForm(!showForm); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Project"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                placeholder="Slug (URL identifier)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                required
              />
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                required
              />
              <input
                placeholder="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <input
                placeholder="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <textarea
              placeholder="Challenge"
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
            <textarea
              placeholder="Solution"
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
            <textarea
              placeholder="Results"
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
            <input
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded bg-slate-900 border-slate-800"
              />
              <label htmlFor="featured" className="text-sm text-slate-300">Featured on homepage</label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              {editing ? "Update Project" : "Save Project"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No projects yet. Add your first case study.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                    <p className="text-xs text-slate-400">{project.clientName} · {project.industry}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFeatured(project.id, project.featured)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        project.featured ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 hover:text-white"
                      }`}
                      title={project.featured ? "Unfeature" : "Feature"}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full aspect-video object-cover rounded-lg border border-slate-800/50"
                  />
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`px-2 py-0.5 rounded-md border ${
                    project.status === "published"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-slate-900 text-slate-400 border-slate-800"
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
