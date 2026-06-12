"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "Custom Ecommerce", href: "/services/ecommerce" },
    { label: "AI Automations & Agents", href: "/services/ai-automation" },
    { label: "Lead Generation", href: "/services/lead-generation" },
    { label: "Website Rebuilds", href: "/services/rebuilds" },
    { label: "Chatbots & AI Assistants", href: "/services/chatbots" },
    { label: "SEO & AEO", href: "/services/seo" },
  ],
  Company: [
    { label: "Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "GitHub", href: "https://github.com/ahmadrrrtx" },
    { label: "LinkedIn", href: "#" },
    { label: "Blog", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020617]/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-7 h-7">
                <Image
                  src="/assets/rrrtx-logo.png"
                  alt="RRRTX SYSTEMS"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-none">RRRTX</span>
                <span className="text-[8px] tracking-[0.3em] text-slate-500 uppercase leading-none mt-0.5">Systems</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Custom ecommerce and AI systems built from scratch for brands that outgrew templates.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} RRRTX SYSTEMS. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Built with Next.js, Tailwind, and intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
