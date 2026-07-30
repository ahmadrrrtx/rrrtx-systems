import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getPublicChrome } from "@/lib/navigation";
import { MobileNavigation } from "./MobileNavigation";

export async function Navbar() {
  const { navbar_links: links } = await getPublicChrome();
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.065] bg-[#020617]/82 shadow-[0_10px_35px_-28px_rgba(0,0,0,.95),inset_0_-1px_0_rgba(255,255,255,.02)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[#020617]/72">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 lg:h-20">
        <Link prefetch={false} href="/" className="flex items-center gap-2 group" aria-label="RRRTX Systems home">
          <div className="relative w-8 h-8 lg:w-10 lg:h-10"><Image src="/assets/rrrtx-logo.png" alt="" fill sizes="40px" className="object-contain" priority /></div>
          <div className="flex flex-col"><span className="text-lg lg:text-xl font-bold tracking-tight text-white leading-none">RRRTX</span><span className="text-[9px] lg:text-[10px] tracking-[0.3em] text-slate-300 uppercase font-medium leading-none mt-0.5">Systems</span></div>
        </Link>

        <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary navigation">
          {links.map((link) => <div key={link.label} className="relative group/nav focus-within:z-20">
            <Link prefetch={false} href={link.href} className="relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-200 transition-[color,background-color,transform] duration-200 ease-[var(--ease-premium)] hover:-translate-y-px hover:bg-white/[0.055] hover:text-white" aria-haspopup={link.children ? "menu" : undefined}>
              {link.label}{link.children && <ChevronDown className="w-3.5 h-3.5 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180 transition-transform" aria-hidden="true" />}
            </Link>
            {link.children && <div role="menu" className="premium-surface invisible absolute left-0 top-full mt-2 w-60 translate-y-2 overflow-hidden rounded-2xl border-slate-700/70 opacity-0 shadow-[0_28px_70px_-24px_rgba(0,0,0,.95)] transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-premium)] group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
              {link.children.map((child) => <Link prefetch={false} role="menuitem" key={child.label} href={child.href} className="block border-b border-white/[0.025] px-4 py-2.5 text-sm text-slate-200 transition-[color,background-color,padding] duration-200 last:border-0 hover:bg-white/[0.055] hover:pl-[1.15rem] hover:text-cyan-200">{child.label}</Link>)}
            </div>}
          </div>)}
        </div>

        <div className="hidden lg:block"><Link prefetch={false} href="/contact" className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white">Book a Free Call</Link></div>
        <MobileNavigation links={links} />
      </div></div>
    </nav>
  );
}
