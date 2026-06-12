"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Folder, File, Code, Link, ArrowRight, ExternalLink } from "lucide-react";

interface GitHubItem {
  name: string;
  path: string;
  type: "file" | "dir";
  html_url: string;
  download_url?: string;
  size?: number;
}

export default function AssetsPage() {
  const [owner, setOwner] = useState("ahmadrrrtx");
  const [repo, setRepo] = useState("Gemma-4-RSS-Intelligence-Monitor");
  const [path, setPath] = useState("");
  const [assets, setAssets] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/github/assets?owner=${owner}&repo=${repo}&path=${path}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAssets(data);
        } else {
          setError("No files found or this is a single file.");
          setAssets([]);
        }
      } else {
        const err = await res.json();
        setError(err.error || "Failed to fetch GitHub assets");
        setAssets([]);
      }
    } catch (err) {
      setError("Network error fetching assets");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (itemPath: string) => {
    setPath(itemPath);
    setTimeout(() => fetchAssets(), 0);
  };

  const goUp = () => {
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    setPath(parts.join("/"));
    setTimeout(() => fetchAssets(), 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Asset Manager</h1>
          <p className="text-sm text-slate-400">Browse GitHub repositories and copy asset links.</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800/50 bg-slate-950/40 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Owner</label>
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Repository</label>
              <input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Path</label>
              <div className="flex gap-2">
                <input
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="e.g. assets/"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={fetchAssets}
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {path && (
            <button
              onClick={goUp}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to parent
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-sm text-slate-500">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Enter a repo and click the arrow to browse assets.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800/50 bg-slate-950/40 overflow-hidden divide-y divide-slate-800/50">
            {assets.map((item) => (
              <div
                key={item.path}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === "dir" ? (
                    <button
                      onClick={() => navigate(item.path)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <Folder className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                      <File className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.type === "file" && item.download_url && (
                    <button
                      onClick={() => {
                        const jsdelivr = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${"main"}/${item.path}`;
                        navigator.clipboard.writeText(jsdelivr);
                        alert("Copied jsdelivr link!");
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Copy jsdelivr CDN link"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <a
                    href={item.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
