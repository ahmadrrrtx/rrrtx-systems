"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  FolderOpen,
  Layers,
  MessageSquare,
  Image as ImageIcon,
  ChevronRight,
  LogOut,
  Star,
  Users,
  DollarSign,
  Settings,
  FileText,
  Download,
} from "lucide-react";

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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#020617] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#020617]/95 backdrop-blur-xl fixed h-full z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
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
              <span className="text-[7px] tracking-[0.3em] text-slate-500 uppercase leading-none mt-0.5">Dashboard</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-white/5 text-cyan-400 border border-white/5"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src="/assets/rrrtx-logo.png"
              alt="RRRTX SYSTEMS"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white leading-none">RRRTX</span>
            <span className="text-[7px] tracking-[0.3em] text-slate-500 uppercase leading-none mt-0.5">Dashboard</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-white"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
