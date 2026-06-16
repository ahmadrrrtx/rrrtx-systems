"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, Sparkles, RefreshCw, BarChart, FileText, CheckCircle, Info } from "lucide-react";

interface AuditResult {
  scores: {
    websiteClarity: number;
    trustCredibility: number;
    conversionCapture: number;
    seoVisibility: number;
    performanceUX: number;
    systemsOpportunity: number;
  };
  recommendations: {
    area: string;
    score: number;
    critique: string;
    fix: string;
  }[];
}

export default function AuditPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    businessType: "Ecommerce",
    helpWith: "Conversion Rate Optimization"
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (scores: AuditResult["scores"]) => {
    const total = 
      scores.websiteClarity + 
      scores.trustCredibility + 
      scores.conversionCapture + 
      scores.seoVisibility + 
      scores.performanceUX + 
      scores.systemsOpportunity;
    return Math.round((total / 60) * 100);
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Conversion Engineering
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Free Systems & <span className="text-gradient">Conversion Audit.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Submit your URL and let our automated heuristics engine analyze your conversion bottlenecks, speed, and AI optimization opportunities.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 sm:p-10 rounded-2xl bg-slate-950/40 border border-slate-800/60 shadow-xl space-y-6 max-w-2xl mx-auto"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Work Email</label>
                      <input
                        required
                        type="email"
                        placeholder="e.g. john@brand.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Website URL</label>
                    <input
                      required
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={form.websiteUrl}
                      onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Business Type</label>
                      <select
                        value={form.businessType}
                        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="Ecommerce">Ecommerce & Brand Store</option>
                        <option value="SaaS">SaaS & B2B Software</option>
                        <option value="Agency">Agency & Consulting</option>
                        <option value="Local Business">Local Business & Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Need</label>
                      <select
                        value={form.helpWith}
                        onChange={(e) => setForm({ ...form, helpWith: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="Conversion Rate Optimization">Conversion Rate Optimization (CRO)</option>
                        <option value="AI automations & Agents">AI Automations & Python Agents</option>
                        <option value="Custom Next.js Systems">Custom Headless Development</option>
                        <option value="Technical SEO Audits">AEO & Technical SEO Optimization</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 mt-4 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Site Heuristics...
                      </>
                    ) : (
                      <>
                        Analyze My Website <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-2.5 pt-4 text-slate-500 text-xs justify-center border-t border-slate-900">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Secure SSL connection. No database password required.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Result Card Header */}
                <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-purple-500/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 flex-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                      <Sparkles className="w-3.5 h-3.5" /> Systems Audit Compiled
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-tight">Analysis Report for {form.websiteUrl.replace(/https?:\/\//i, "")}</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      We have compiled the heuristic conversion scoring metrics based on standard performance bottlenecks, UX roadblocks, and automation openings.
                    </p>
                  </div>
                  <div className="relative shrink-0 w-32 h-32 rounded-full border-2 border-cyan-500/40 flex flex-col items-center justify-center bg-slate-950/80 shadow-2xl">
                    <span className="text-4xl font-extrabold text-white">{calculateOverallScore(result.scores)}%</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 font-bold">Overall Score</span>
                  </div>
                </div>

                {/* Score breakdown metrics grids */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Website Clarity", val: result.scores.websiteClarity, icon: Info },
                    { label: "Trust & Credibility", val: result.scores.trustCredibility, icon: ShieldCheck },
                    { label: "Conversion Rate Optimize", val: result.scores.conversionCapture, icon: Sparkles },
                    { label: "SEO & Visibility", val: result.scores.seoVisibility, icon: BarChart },
                    { label: "Performance & UX", val: result.scores.performanceUX, icon: RefreshCw },
                    { label: "Systems Opportunity", val: result.scores.systemsOpportunity, icon: FileText },
                  ].map((metric) => (
                    <div key={metric.label} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <metric.icon className="w-4 h-4 text-cyan-400" />
                        <span className="text-lg font-bold text-white">{metric.val}/10</span>
                      </div>
                      <div className="text-xs text-slate-300 font-semibold">{metric.label}</div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full"
                          style={{ width: `${metric.val * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Structured detailed actionable recommendation items */}
                <div className="p-6 sm:p-8 rounded-2xl border border-slate-800/60 bg-slate-950/40 space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" /> Critical Actionable Recommendations
                  </h3>
                  <div className="space-y-6">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-extrabold text-cyan-400 shrink-0">
                            {i + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white">{rec.area}</h4>
                          <span className="text-xs font-semibold text-slate-500 ml-auto">Impact: High</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-9">{rec.critique}</p>
                        <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-lg text-xs text-cyan-300 pl-4 ml-9 flex items-start gap-2 leading-relaxed">
                          <span className="font-extrabold text-[10px] uppercase tracking-wider text-cyan-400 mt-0.5">FIX:</span>
                          <span>{rec.fix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy session CTA box */}
                <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-cyan-500/20 shadow flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Let RRRTX Improvement These Metrics</h3>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Our custom conversion & engineering study has shipped sub-0.5s loading stores and automated systems that qualified 5,000+ business leads on autopilot.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setResult(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-950/20 hover:bg-slate-900 transition-all"
                    >
                      Audit Another Site
                    </button>
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-1 px-5 py-2.5 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
                    >
                      Book Free strategy Call <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
