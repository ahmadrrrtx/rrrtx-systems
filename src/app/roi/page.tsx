"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle, DollarSign, Clock, TrendingUp, RefreshCw, CheckCircle } from "lucide-react";

export default function ROICalculatorPage() {
  const [form, setForm] = useState({
    monthlyLeads: "500",
    conversionRate: "2.0",
    averageValue: "1500",
    currentRevenue: "15000",
    timeSpentManual: "24",
    costManual: "40",
    expectedImprovement: "15",
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">
              Value Engineering
            </p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Business ROI & <span className="text-gradient">Automation Calculator.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Input your current conversion and manual work metrics to calculate precisely how much revenue and time our custom-engineered systems can save for your business.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Column */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 border-b border-slate-900 pb-2">Enter Your Metrics</h3>
              <form onSubmit={handleCalculate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Monthly Traffic / Leads</label>
                  <input
                    type="number"
                    value={form.monthlyLeads}
                    onChange={(e) => setForm({ ...form, monthlyLeads: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Conversion Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.conversionRate}
                    onChange={(e) => setForm({ ...form, conversionRate: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Average Order / Deal Value ($)</label>
                  <input
                    type="number"
                    value={form.averageValue}
                    onChange={(e) => setForm({ ...form, averageValue: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Manual Work Task Time (Hours/mo)</label>
                  <input
                    type="number"
                    value={form.timeSpentManual}
                    onChange={(e) => setForm({ ...form, timeSpentManual: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Staff Labor Cost ($/hour)</label>
                  <input
                    type="number"
                    value={form.costManual}
                    onChange={(e) => setForm({ ...form, costManual: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Lift Improvement (%)</label>
                  <select
                    value={form.expectedImprovement}
                    onChange={(e) => setForm({ ...form, expectedImprovement: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="10">10% Improvement</option>
                    <option value="15">15% Improvement (Recommended)</option>
                    <option value="25">25% (Advanced Systems Rebuild)</option>
                    <option value="40">40% (Full AI Automation Upgrade)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 mt-2 text-xs font-semibold text-white rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing Formulas...
                    </>
                  ) : (
                    <>
                      Calculate ROI Impact <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                {!results ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-2xl border border-dashed border-slate-800 text-center py-20 bg-slate-950/10"
                  >
                    <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-300">Formulas Ready to Calculate</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                      Enter your current monthly traffic, order rates, and operational manual costs in the left panel to calculate your annual savings and revenue uplift.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results-box"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Main Annual impact card */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-purple-500/30 shadow-lg shadow-purple-950/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Total Projected Impact</span>
                      <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-2">
                        +${results.annualImpact.toLocaleString()} <span className="text-sm font-semibold text-slate-500">/ yr</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                        This reflects the combined savings from automating manual operational workflows and scaling conversion conversion lift across your current business flows.
                      </p>
                    </div>

                    {/* Metric breakdown cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Monthly Revenue Gain</span>
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-xl font-bold text-white">+${results.roiUplift.toLocaleString()}</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Increase in monthly sales revenue.</p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Time Savings</span>
                          <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-xl font-bold text-white">{results.timeSavings} Hours</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Manual hours saved through smart automations.</p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Time Cost Reclaimed</span>
                          <DollarSign className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-xl font-bold text-white">${Math.floor(results.timeSavings * (parseFloat(form.costManual) || 40))} / mo</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Operational budget reclaimed.</p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Estimated Lost Revenue</span>
                          <span className="text-red-400 font-extrabold text-[10px]">CURRENT</span>
                        </div>
                        <div className="text-xl font-bold text-slate-400">${results.lostRevenue.toLocaleString()}</div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Money lost currently to leaks.</p>
                      </div>
                    </div>

                    {/* Explanatory notes */}
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 text-xs text-slate-500 leading-relaxed">
                      <strong>Methodology & Formulas:</strong> Calculations are based on your monthly traffic of {form.monthlyLeads} leads. A conversion improvement of {form.expectedImprovement}% yields additional customer order units worth ${form.averageValue} each, layered with the reclaiming of operational staff costs at ${form.costManual}/hr.
                    </div>

                    {/* CTA Box */}
                    <div className="p-6 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-blue-900/10 to-purple-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white leading-none mb-1">Let's Improve These Numbers</h4>
                        <p className="text-[10px] text-slate-400 max-w-sm">Book a free strategical planning audit session to construct this system.</p>
                      </div>
                      <a
                        href="/contact"
                        className="px-4 py-2 text-xs font-bold text-white rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow shrink-0 inline-flex items-center gap-1"
                      >
                        Book Strategy Call <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
