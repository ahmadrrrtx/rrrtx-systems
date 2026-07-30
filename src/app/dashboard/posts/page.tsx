"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle, FileText, Calendar, Tag } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  tags: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string; // "draft" | "published"
  publishedAt: string;
  createdAt: string;
}

export default function BlogDashboardPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    tags: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    publishedAt: "",
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/posts");
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

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchItems(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === "" || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content,
      coverImageUrl: p.coverImageUrl || "",
      tags: p.tags || "",
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      status: p.status,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      tags: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      publishedAt: "",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString(),
      };
      const res = await fetch("/api/posts", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
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
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "published" ? "draft" : "published";
      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
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
            <h1 className="text-2xl font-bold text-white mb-1">Blog Posts</h1>
            <p className="text-sm text-slate-400">Write, edit, and publish blog articles.</p>
          </div>
          <button
            onClick={() => (editing ? resetForm() : setShowForm(!showForm))}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Create Post"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dashboard-posts-title-1" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                <input
                  id="dashboard-posts-title-1"
                  name="dashboard-posts-title-1"
                  required
                  placeholder="Post Title"
                  value={form.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label htmlFor="dashboard-posts-slug-2" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Slug</label>
                <input
                  id="dashboard-posts-slug-2"
                  name="dashboard-posts-slug-2"
                  required
                  placeholder="post-slug"
                  value={form.slug}
                  disabled={Boolean(editing)}
                  onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dashboard-posts-status-3" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                <select
                  id="dashboard-posts-status-3"
                  name="dashboard-posts-status-3"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label htmlFor="dashboard-posts-publish-date-4" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Publish Date</label>
                <input
                  id="dashboard-posts-publish-date-4"
                  name="dashboard-posts-publish-date-4"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label htmlFor="dashboard-posts-tags-comma-separated-5" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                <input
                  id="dashboard-posts-tags-comma-separated-5"
                  name="dashboard-posts-tags-comma-separated-5"
                  placeholder="ecommerce, ai, marketing"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dashboard-posts-excerpt-6" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Excerpt</label>
              <textarea
                  id="dashboard-posts-excerpt-6"
                  name="dashboard-posts-excerpt-6"
                placeholder="Brief summary of the article..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div>
              <label htmlFor="dashboard-posts-content-markdown-supported-7" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Content (Markdown supported)</label>
              <textarea
                  id="dashboard-posts-content-markdown-supported-7"
                  name="dashboard-posts-content-markdown-supported-7"
                required
                placeholder="Write your article content here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            <div>
              <label htmlFor="dashboard-posts-cover-image-url-8" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cover Image URL</label>
              <input
                  id="dashboard-posts-cover-image-url-8"
                  name="dashboard-posts-cover-image-url-8"
                placeholder="https://example.com/image.png"
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-800/50 pt-4">
              <div>
                <label htmlFor="dashboard-posts-meta-title-seo-9" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Meta Title (SEO)</label>
                <input
                  id="dashboard-posts-meta-title-seo-9"
                  name="dashboard-posts-meta-title-seo-9"
                  placeholder="Meta Title"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label htmlFor="dashboard-posts-meta-description-seo-10" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Meta Description (SEO)</label>
                <input
                  id="dashboard-posts-meta-description-seo-10"
                  name="dashboard-posts-meta-description-seo-10"
                  placeholder="Meta Description"
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              {editing ? "Update Post" : "Publish Post"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading posts...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No blog posts yet.</div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {items.map((p) => (
              <div key={p.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                        p.status === "published"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> /{p.slug}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(p.publishedAt).toLocaleDateString()}
                    </span>
                    {p.tags && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {p.tags}
                      </span>
                    )}
                  </div>
                  {p.excerpt && <p className="text-xs text-slate-500 mt-2 truncate max-w-2xl">{p.excerpt}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleStatus(p.id, p.status)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      p.status === "published" ? "text-green-400 hover:bg-green-500/10" : "text-slate-500 hover:text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(p.id)}
                    aria-label={`Move ${p.title} to draft`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
