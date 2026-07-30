"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/navigation";

export function MobileNavigation({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" className="rounded-xl border border-transparent p-2.5 text-slate-300 transition-[color,background-color,border-color,transform] duration-200 hover:border-slate-700 hover:bg-white/[0.05] hover:text-white active:scale-95" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation">
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open && (
        <div id="mobile-navigation" className="premium-surface animate-fade-up fixed inset-x-3 top-[4.5rem] max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border-slate-700/70 px-3 py-4 shadow-[0_30px_80px_-25px_rgba(0,0,0,.98)]">
          <nav aria-label="Mobile navigation" className="space-y-1">
            {links.map((link) => (
              <div key={link.label}>
                <Link prefetch={false} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm text-slate-200 transition-colors hover:bg-white/[0.055] hover:text-cyan-200">{link.label}</Link>
                {link.children && <div className="ml-4 space-y-1 border-l border-slate-700/70 pl-2">{link.children.map((child) => <Link prefetch={false} key={child.label} href={child.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white">{child.label}</Link>)}</div>}
              </div>
            ))}
            <Link prefetch={false} href="/contact" onClick={() => setOpen(false)} className="premium-button mt-3 block rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-center text-sm font-medium text-white">Book a Free Call</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
