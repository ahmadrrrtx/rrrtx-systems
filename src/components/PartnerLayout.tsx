"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  ChevronRight,
  FileText,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";

const navItems = [
  { href: "/partner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/partner/referrals", icon: Handshake, label: "Referrals" },
  { href: "/partner/commissions", icon: FolderOpen, label: "Commissions" },
  { href: "/partner/rank", icon: Award, label: "Rank & Achievements" },
  { href: "/partner/documents", icon: FileText, label: "Documents" },
  { href: "/partner/resources", icon: ChevronRight, label: "Resources" },
  { href: "/partner/profile", icon: User, label: "Profile" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-7 h-7">
        <Image src="/assets/rrrtx-logo.png" alt="" fill sizes="28px" className="object-contain" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white leading-none">RRRTX</span>
        <span className="text-[8px] tracking-[0.25em] text-slate-400 uppercase leading-none mt-1">Partner Portal</span>
      </div>
    </div>
  );
}

export function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/partner/auth/logout", { method: "POST" });
    router.replace("/partner/login");
    router.refresh();
  };

  const navigation = (
    <nav aria-label="Partner navigation" className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/partner/dashboard" && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4" aria-hidden="true" />
            {item.label}
            {isActive && <ChevronRight className="w-3 h-3 ml-auto" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex print:block">
      <aside className="w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl fixed h-full z-40 hidden lg:flex flex-col print:hidden">
        <div className="p-6 border-b border-white/5">
          <Brand />
        </div>
        {navigation}
        <div className="p-4 border-t border-white/5">
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 w-full">
            <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 justify-between print:hidden">
        <Brand />
        <div className="flex items-center gap-1">
          <button type="button" onClick={handleLogout} aria-label="Sign out" className="p-2.5 text-slate-300 hover:text-white rounded-lg">
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close partner menu" : "Open partner menu"}
            aria-expanded={mobileOpen}
            aria-controls="partner-mobile-menu"
            className="p-2.5 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div id="partner-mobile-menu" className="lg:hidden fixed inset-0 z-40 pt-16 bg-[#020617]/98 flex flex-col print:hidden">
          {navigation}
        </div>
      )}

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-w-0 print:ml-0 print:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto print:p-0 print:max-w-none">{children}</div>
      </main>
    </div>
  );
}
