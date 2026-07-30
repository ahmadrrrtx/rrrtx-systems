import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero({
  titleLines,
  subtitle,
  ctaText,
  ctaLink,
}: {
  titleLines?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}) {
  const lines = titleLines
    ? titleLines.split(",").map((line) => line.trim()).filter(Boolean)
    : ["We Build", "Systems That", "Attract Leads,", "Close Sales & Scale", "Your Business"];
  const activeSubtitle = subtitle || "Custom ecommerce websites and AI systems built to convert. We build premium sites from scratch with dashboards, automations, and AI tools that help your brand sell better, work faster, and scale globally.";
  const activeCtaText = ctaText || "Get Your Free Strategy Call";
  const activeCtaLink = ctaLink || "/contact";

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-28 lg:pt-32 pb-16 lg:pb-20">
      <div className="absolute top-0 left-0 right-0 h-40 lg:h-48 pointer-events-none z-[2] bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent" />
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              {lines.map((line, index) => {
                const isGradient = index === 2 || index === 3 || /lead|sale|scale|convert|roi/i.test(line);
                return <span key={`${line}-${index}`} className={isGradient ? "text-gradient" : "text-white"}>{line}{index < lines.length - 1 && <br />}</span>;
              })}
            </h1>
            <p className="text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed">{activeSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link prefetch={false} href={activeCtaLink} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40">
                {activeCtaText}<ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link prefetch={false} href="/work" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-300 rounded-lg border border-slate-700 hover:border-slate-500 hover:text-white transition-all bg-slate-900/30">
                <Play className="w-4 h-4" aria-hidden="true" />View Our Work
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" aria-hidden="true" />
              <Image src="/assets/hero-holographic-hand.webp" alt="RRRTX system architecture visualization" fill sizes="(min-width: 1280px) 600px, 50vw" className="object-contain drop-shadow-2xl animate-float" />
              <div className="absolute top-10 right-0 glass-card px-4 py-3"><div className="text-[10px] uppercase tracking-wider text-slate-300 mb-1">AI Automations</div><div className="text-sm font-semibold text-cyan-400">Workflows that save time</div></div>
              <div className="absolute top-1/3 -left-4 glass-card px-4 py-3"><div className="text-[10px] uppercase tracking-wider text-slate-300 mb-1">Lead Generation</div><div className="text-sm font-semibold text-purple-400">Get qualified leads on autopilot</div></div>
              <div className="absolute bottom-20 right-4 glass-card px-4 py-3"><div className="text-[10px] uppercase tracking-wider text-slate-300 mb-1">Conversion Engineering</div><div className="text-sm font-semibold text-blue-400">Journeys designed to convert</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
