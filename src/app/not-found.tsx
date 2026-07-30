import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">404</p>
        <h1 className="text-4xl font-bold text-white mb-4">This route has not shipped.</h1>
        <p className="text-slate-400 mb-8">The page may have moved, or the address may be incorrect.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">
            Return home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/services" className="px-5 py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-slate-300 hover:text-white">
            Explore services
          </Link>
        </div>
      </div>
    </main>
  );
}
