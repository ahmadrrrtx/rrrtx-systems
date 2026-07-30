"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/lib/navigation";

export function MobileNavigation({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" className="p-2.5 text-slate-300 hover:text-white" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation">
        {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
      </button>
      {open && <div id="mobile-navigation" className="fixed top-16 left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-[#020617]/98 backdrop-blur-xl border-b border-white/5 px-4 py-4 shadow-2xl">
        <nav aria-label="Mobile navigation" className="space-y-1">
          {links.map((link) => <div key={link.label}><Link prefetch={false} href={link.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm text-slate-200 hover:text-white rounded-lg hover:bg-white/5">{link.label}</Link>{link.children && <div className="ml-4 space-y-1 border-l border-slate-800 pl-2">{link.children.map((child) => <Link prefetch={false} key={child.label} href={child.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-xs text-slate-300 hover:text-white">{child.label}</Link>)}</div>}</div>)}
          <Link prefetch={false} href="/contact" onClick={() => setOpen(false)} className="block mt-3 px-4 py-3 text-sm font-medium text-center text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">Book a Free Call</Link>
        </nav>
      </div>}
    </div>
  );
}
