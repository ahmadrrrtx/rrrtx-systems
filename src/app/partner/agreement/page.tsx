"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import type { AgreementSection } from "@/lib/partner-agreement";

export default function PartnerAgreement() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState("");
  const [sections, setSections] = useState<AgreementSection[]>([]);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [signedName, setSignedName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/partner/agreement");
        if (res.status === 401) {
          router.replace("/partner/login");
          return;
        }
        const data = await res.json();
        setVersion(data.version);
        setSections(data.sections || []);
        setAlreadySigned(Boolean(data.signed));
      } catch {
        setError("Failed to load the agreement.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/partner/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedName, acknowledged }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setAlreadySigned(true);
      } else {
        setError(data.error || "Could not record acceptance");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
        <p className="text-sm text-slate-400">Loading agreement…</p>
      </main>
    );
  }

  if (done || alreadySigned) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Agreement signed</h1>
          <p className="text-sm text-slate-400 mb-8">
            {done ? "Thank you. Your acceptance has been recorded." : "You have already accepted this version."} Your onboarding is complete — you can now access your dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push("/partner/dashboard")}
            className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Onboarding step 3 of 3</p>
              <h1 className="text-2xl font-bold text-white">RRRTX Partner Network Agreement</h1>
            </div>
          </div>
          <p className="text-sm text-slate-400">Version {version} · Please read the full agreement before accepting.</p>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span>This is the agreement that governs your participation and commission. Your typed name constitutes your electronic signature.</span>
          </div>
        </header>

        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.number} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6">
              <h2 className="text-sm font-semibold text-white mb-3">
                {section.number}. {section.title}
                {section.lawyerReview && <span className="ml-2 text-[10px] font-normal uppercase tracking-wide text-slate-500">(standard clause)</span>}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm text-slate-300 leading-relaxed mb-2 last:mb-0">{p}</p>
              ))}
            </section>
          ))}
        </div>

        <form onSubmit={handleSign} className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" aria-hidden="true" /> Accept & sign
          </h2>
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 accent-cyan-500"
            />
            <span className="text-sm text-slate-200">
              I confirm that I have read, understood, and agree to the RRRTX Partner Network Agreement (Version {version}).
            </span>
          </label>
          <div>
            <label htmlFor="signed-name" className="block text-sm font-medium text-slate-300 mb-2">Type your legal name to sign</label>
            <input
              id="signed-name"
              value={signedName}
              onChange={(e) => setSignedName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              placeholder="Your full legal name"
            />
            <p className="mt-2 text-xs text-slate-500">By signing you accept this agreement electronically. The version, timestamp, and integrity metadata are recorded.</p>
          </div>
          <button
            type="submit"
            disabled={submitting || !acknowledged || !signedName.trim()}
            className="premium-button inline-flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Recording acceptance…" : "Accept & Sign Agreement"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}
