"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import * as Icons from "lucide-react";

interface StatItem {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { icon: "Rocket", value: 15, suffix: "+", label: "Projects Delivered" },
  { icon: "Users", value: 12, suffix: "+", label: "Happy Clients" },
  { icon: "TrendingUp", value: 18, suffix: "%", label: "Avg. ROI Lift" },
  { icon: "Clock", value: 24, suffix: "/7", label: "Systems Running" },
  { icon: "Globe", value: 5, suffix: "+", label: "Countries Served" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic for smoother ending
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsBar({ stats }: { stats?: StatItem[] }) {
  const activeStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="relative py-14 border-b border-white/[0.04]">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-500/[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
          {activeStats.map((stat, i) => {
            const IconComponent = (Icons as Record<string, any>)[stat.icon] || Icons.Rocket;
            return (
              <motion.div
                key={`${stat.label}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative text-center group"
              >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900/80 border border-slate-800/60 mb-3 group-hover:border-slate-700/80 transition-colors">
                    <IconComponent className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-[0.15em] font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
