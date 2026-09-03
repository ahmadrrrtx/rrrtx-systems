"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, KeyRound, Lock } from "lucide-react";
import { trackEvent } from "@/components/AnalyticsClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/partner/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/partner/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        trackEvent("partner_login", {});
        router.push(next);
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Partner Login</h1>
        <p className="text-sm text-slate-400">RRRTX Partner Network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-8">
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400" role="alert">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="partner-email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            id="partner-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="partner-password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input
            id="partner-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            placeholder="••••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5 text-sm">
        <p className="text-slate-300 flex items-center gap-2 mb-2">
          <KeyRound className="w-4 h-4 text-cyan-400" aria-hidden="true" /> First time here?
        </p>
        <p className="text-slate-500 text-xs leading-relaxed mb-3">
          After your application is approved you receive a Partner ID and a one-time setup code. Use it to create your password.
        </p>
        <Link href="/partner/activate" className="text-cyan-400 hover:text-cyan-300 text-xs font-medium">Activate your account</Link>
      </div>

      <p className="mt-6 text-center">
        <Link href="/partners" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Partner Network
        </Link>
      </p>
    </motion.div>
  );
}

export default function PartnerLogin() {
  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
