"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Lock, CheckCircle, FileText, X, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";
import { trackEvent } from "@/components/AnalyticsClient";

interface Resource {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  category: string;
  fileType: string;
  isGated: boolean;
  downloadUrl: string;
}

export function ResourcesClient({ initialItems }: { initialItems: Resource[] }) {
  const [items] = useState<Resource[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeGatedResource, setActiveGatedResource] = useState<Resource | null>(null);

  // Form lead fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [unlockedUrl, setUnlockedUrl] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeGatedResource) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGatedResource(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeGatedResource]);

  // Filter lists
  const categories = ["All", "PDF", "Checklist", "Guide", "Template", "XLSX"];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return (
      item.category.toLowerCase() === selectedCategory.toLowerCase() ||
      item.fileType.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const handleDownloadClick = async (resource: Resource) => {
    // If not gated, trigger download link directly
    if (!resource.isGated) {
      trackEvent("resource_download", { resource: resource.title, gated: false });
      window.open(resource.downloadUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Gated, open capture modal
    setActiveGatedResource(resource);
    setName("");
    setEmail("");
    setSuccess(false);
    setError("");
    setUnlockedUrl("");
  };

  const handleGatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGatedResource) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, resourceId: activeGatedResource.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The resource could not be unlocked. Please try again.");
        return;
      }
      setUnlockedUrl(data.downloadUrl);
      setSuccess(true);
      trackEvent("resource_unlock", { resource: activeGatedResource.title });
    } catch (requestError) {
      console.error("Gated lead submission failed", requestError);
      setError("A network error interrupted the request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
            Knowledge Hub
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Free Systems & <span className="text-gradient">Engineering Library.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Download our custom checklist guides, technical audit sheets, and website planning templates created by our full-stack engineering team.
          </p>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 select-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800/80 rounded-2xl max-w-md mx-auto">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No Resources Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Our engineering team is actively preparing custom checklists. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((res) => (
              <div
                key={res.id}
                className="flex flex-col rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-all duration-300 overflow-hidden group"
              >
                {/* Visual Thumbnail */}
                <div className="aspect-[16/10] bg-slate-900 border-b border-slate-800/50 relative overflow-hidden flex items-center justify-center p-6">
                  {res.coverImageUrl ? (
                    <SmartImage
                      src={res.coverImageUrl}
                      alt={res.title}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border border-slate-800">
                    {res.fileType}
                  </span>
                  {res.isGated && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-purple-900/60 text-[10px] font-bold text-purple-200 uppercase tracking-wider border border-purple-800/40 inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Gated
                    </span>
                  )}
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-1">
                      Category: {res.category}
                    </span>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadClick(res)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded bg-slate-900 border border-slate-800 group-hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    {res.isGated ? "Enter Info to Download" : "Instant Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Capture Popup Modal for Gated resources */}
        <AnimatePresence>
          {activeGatedResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveGatedResource(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="resource-dialog-title"
                aria-describedby="resource-dialog-description"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Premium Resource Gated</span>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setActiveGatedResource(null)}
                    aria-label="Close resource download dialog"
                    className="p-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h2 id="resource-dialog-title" className="text-base font-bold text-white leading-tight">Unlock: {activeGatedResource.title}</h2>
                  <p id="resource-dialog-description" className="text-xs text-slate-400 leading-relaxed">
                    Provide your work details below to gain instant access to download this customized full-stack planning asset.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 flex flex-col items-center justify-center text-center space-y-2"
                    >
                      <CheckCircle className="w-10 h-10 text-green-400 animate-bounce" />
                      <h3 className="text-sm font-bold text-white">Access granted</h3>
                      <p className="text-xs text-slate-400">Your resource is ready. Open it using the link below.</p>
                      <a href={unlockedUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-bold text-white">
                        Open resource <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleGatedSubmit}
                      className="space-y-3.5"
                    >
                      <div>
                        <label htmlFor="resource-name" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                          id="resource-name"
                          name="name"
                          autoComplete="name"
                          maxLength={120}
                          required
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="resource-email" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Work Email</label>
                        <input
                          id="resource-email"
                          name="email"
                          autoComplete="email"
                          maxLength={254}
                          required
                          type="email"
                          placeholder="john@brand.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                        />
                      </div>

                      {error && (
                        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" /> {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 mt-2 text-xs font-bold text-white rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Unlocking File...
                          </>
                        ) : (
                          <>
                            Unlock & Download File <Download className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
