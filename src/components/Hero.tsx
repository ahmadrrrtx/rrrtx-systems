"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ThreeScene } from "./ThreeScene";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20 lg:pt-0">
      {/* Three.js background scene */}
      <ThreeScene />
      {/* Top scrim: keeps the logo/navbar area clean so 3D objects fade behind it */}
      <div className="absolute top-0 left-0 right-0 h-40 lg:h-48 pointer-events-none z-[2] bg-gradient-to-b from-[#020617] via-[#020617]/70 to-transparent" />
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"/>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]"/>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              <span className="text-white">We Build</span>
              <br/>
              <span className="text-white">Systems That</span>
              <br/>
              <span className="text-gradient">Attract Leads,</span>
              <br/>
              <span className="text-gradient">Close Sales & Scale</span>
              <br/>
              <span className="text-white">Your Business</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base lg:text-lg text-slate-400 max-w-xl leading-relaxed"
            >
              Custom ecommerce websites and AI systems built to convert. We build
              premium sites from scratch with dashboards, automations, and AI tools
              that help your brand sell better, work faster, and scale globally.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/25 hover:shadow-purple-900/40"
              >
                Get Your Free Strategy Call
                <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-300 rounded-lg border border-slate-700 hover:border-slate-500 hover:text-white transition-all bg-slate-900/30"
              >
                <Play className="w-4 h-4"/>
                View Our Work
              </Link>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"/>
              <motion.img
                src="/assets/hero-holographic-hand.png"
                alt="AI Systems Visualization"
                className="relative w-full h-full object-contain drop-shadow-2xl"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Floating UI Cards overlay */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-10 right-0 glass-card px-4 py-3"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">AI Automations</div>
                <div className="text-sm font-semibold text-cyan-400">Workflows that save time</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/3 -left-4 glass-card px-4 py-3"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Lead Generation</div>
                <div className="text-sm font-semibold text-purple-400">Get qualified leads on autopilot</div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-20 right-4 glass-card px-4 py-3"
              >
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">High-Converting Websites</div>
                <div className="text-sm font-semibold text-blue-400">Websites designed to attract & convert</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
