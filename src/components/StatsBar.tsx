import { Rocket, Users, TrendingUp, Clock, Globe, Heart, Laptop, Award, Flame, Star, Bot, Activity, DollarSign, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatItem { icon: string; value: number; suffix: string; label: string }
const iconMap: Record<string, LucideIcon> = { Rocket, Users, TrendingUp, Clock, Globe, Heart, Laptop, Award, Flame, Star, Bot, Activity, DollarSign, Shield };

export function StatsBar({ stats }: { stats: StatItem[] }) {
  if (!stats.length) return null;
  return (
    <section className="relative py-14 border-b border-white/[0.04]" aria-label="Verified delivery statistics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
        {stats.map((stat) => { const Icon = iconMap[stat.icon] || Rocket; return <div key={stat.label} className="text-center"><div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800/60 mb-3"><Icon className="w-4 h-4 text-cyan-400" aria-hidden="true" /></div><div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{stat.value}{stat.suffix}</div><div className="text-[11px] text-slate-300 mt-1.5 uppercase tracking-[0.15em] font-medium">{stat.label}</div></div>; })}
      </div></div>
    </section>
  );
}
