"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="max-w-lg text-center rounded-2xl border border-slate-800 bg-slate-950/60 p-8">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">This page could not be loaded</h1>
        <p className="text-sm text-slate-400 mb-6">
          Your data is safe. Try the request again or return to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link href="/" className="px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
