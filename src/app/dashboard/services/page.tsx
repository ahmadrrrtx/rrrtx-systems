"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Trash, CheckCircle, Pencil } from "lucide-react";

interface Service {
  id: number;
  slug: string;
  title: string;
  shortDescription: string | null;
  isPrimary: boolean;
  isAddon: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    shortDescription: "",
    iconName: "",
    isPrimary: false,
    isAddon: false,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setFormData({
      slug: s.slug,
      title: s.title,
      shortDescription: s.shortDescription || "",
      iconName: "",
      isPrimary: s.isPrimary ?? false,
      isAddon: s.isAddon ?? false,
      sortOrder: s.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ slug: "", title: "", shortDescription: "", iconName: "", isPrimary: false, isAddon: false, sortOrder: 0 });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/services", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...formData } : formData),
      });
      if (res.ok) {
        resetForm();
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !active }),
      });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Services Editor</h1>
            <p className="text-sm text-slate-400">Manage public-facing service offerings.</p>
          </div>
          <button
            onClick={() => { editing ? resetForm() : setShowForm(!showForm); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Service"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                placeholder="Slug (URL path)"
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
            </div>
            <input
              placeholder="Short Description"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <input
              placeholder="Icon Name (e.g. ShoppingCart)"
              value={formData.iconName}
              onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-800"
                />
                Primary Service
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isAddon}
                  onChange={(e) => setFormData({ ...formData, isAddon: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-800"
                />
                Add-on
              </label>
              <input
                type="number"
                placeholder="Sort Order"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm w-24"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              {editing ? "Update Service" : "Save Service"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-500">No services found.</div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                      service.isPrimary
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : service.isAddon
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : "bg-slate-900 text-slate-400 border-slate-800"
                    }`}>
                      {service.isPrimary ? "Primary" : service.isAddon ? "Add-on" : "Standard"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
                      service.isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">/{service.slug} · Order {service.sortOrder}</p>
                  {service.shortDescription && (
                    <p className="text-xs text-slate-500 mt-1">{service.shortDescription}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(service.id, service.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.isActive
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    }`}
                    title="Toggle Active"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
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
