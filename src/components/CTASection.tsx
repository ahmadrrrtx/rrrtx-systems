import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-cyan-500/10 to-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div
        >
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Ready to Build a System That{" "}
            <span className="text-gradient">Actually Works?</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            No template hacks. No bolt-on AI gimmicks. Just clean engineering,
            custom architecture, and a system that converts visitors into revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="premium-button group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white"
            >
              <Calendar className="w-4 h-4" />
              Get Your Free Strategy Call
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/45 px-8 py-4 text-base font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-md transition-[transform,border-color,color] duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-slate-500 hover:text-white"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
