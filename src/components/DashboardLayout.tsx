"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Inbox, FolderOpen, Layers, MessageSquare, Image as ImageIcon, ChevronRight, LogOut, Star, Users, DollarSign, Settings, FileText, Download, Menu, X, Handshake, Target } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/leads", icon: Inbox, label: "Leads" },
  { href: "/dashboard/projects", icon: FolderOpen, label: "Portfolio" },
  { href: "/dashboard/services", icon: Layers, label: "Services" },
  { href: "/dashboard/testimonials", icon: Star, label: "Testimonials" },
  { href: "/dashboard/team", icon: Users, label: "Team" },
  { href: "/dashboard/pricing", icon: DollarSign, label: "Pricing" },
  { href: "/dashboard/prompt-bundles", icon: MessageSquare, label: "Prompt Bundles" },
  { href: "/dashboard/assets", icon: ImageIcon, label: "Assets" },
  { href: "/dashboard/posts", icon: FileText, label: "Blog" },
  { href: "/dashboard/resources", icon: Download, label: "Resources" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const partnerNavItems = [
  { href: "/dashboard/partners", icon: Handshake, label: "Overview" },
  { href: "/dashboard/partners/applications", icon: Inbox, label: "Applications" },
  { href: "/dashboard/partners/partners", icon: Users, label: "Partner Accounts" },
  { href: "/dashboard/partners/referrals", icon: Target, label: "Referrals" },
  { href: "/dashboard/partners/commissions", icon: DollarSign, label: "Commissions" },
];

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-7 h-7"><Image src="/assets/rrrtx-logo.png" alt="" fill sizes="28px" className="object-contain" /></div>
      <div className="flex flex-col"><span className="text-sm font-bold text-white leading-none">RRRTX</span><span className="text-[8px] tracking-[0.25em] text-slate-400 uppercase leading-none mt-1">Dashboard</span></div>
    </div>
  );
}

function NavLinkItem({ item, pathname, onNavigate }: { item: { href: string; icon: typeof Inbox; label: string }; pathname: string; onNavigate: () => void }) {
  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-white/5 text-cyan-400 border border-white/5" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
    >
      <item.icon className="w-4 h-4" aria-hidden="true" />{item.label}{isActive && <ChevronRight className="w-3 h-3 ml-auto" aria-hidden="true" />}
    </Link>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/dashboard/login");
    router.refresh();
  };

  const close = () => setMobileOpen(false);

  const navigation = (
    <nav aria-label="Dashboard navigation" className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLinkItem key={item.href} item={item} pathname={pathname} onNavigate={close} />
      ))}
      <div className="pt-4 pb-1">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Partner Network</p>
      </div>
      {partnerNavItems.map((item) => (
        <NavLinkItem key={item.href} item={item} pathname={pathname} onNavigate={close} />
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex">
      <aside className="w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl fixed h-full z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5"><Brand /></div>
        {navigation}
        <div className="p-4 border-t border-white/5"><button type="button" onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 w-full"><LogOut className="w-4 h-4" aria-hidden="true" />Sign out</button></div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 justify-between">
        <Brand />
        <div className="flex items-center gap-1">
          <button type="button" onClick={handleLogout} aria-label="Sign out" className="p-2.5 text-slate-300 hover:text-white rounded-lg"><LogOut className="w-4 h-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close dashboard menu" : "Open dashboard menu"} aria-expanded={mobileOpen} aria-controls="dashboard-mobile-menu" className="p-2.5 text-slate-300 hover:text-white rounded-lg">
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div id="dashboard-mobile-menu" className="lg:hidden fixed inset-0 z-40 pt-16 bg-[#020617]/98 flex flex-col">
          {navigation}
        </div>
      )}

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
