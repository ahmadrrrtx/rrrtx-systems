import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { getPublicChrome } from "@/lib/navigation";
import { MobileNavigation } from "./MobileNavigation";

export async function Navbar() {
  const { navbar_links: links } = await getPublicChrome();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/85 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 lg:h-20">
        <Link prefetch={false} href="/" className="flex items-center gap-2 group" aria-label="RRRTX Systems home">
          <div className="relative w-8 h-8 lg:w-10 lg:h-10"><Image src="/assets/rrrtx-logo.png" alt="" fill sizes="40px" className="object-contain" priority /></div>
          <div className="flex flex-col"><span className="text-lg lg:text-xl font-bold tracking-tight text-white leading-none">RRRTX</span><span className="text-[9px] lg:text-[10px] tracking-[0.3em] text-slate-300 uppercase font-medium leading-none mt-0.5">Systems</span></div>
        </Link>

        <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary navigation">
          {links.map((link) => <div key={link.label} className="relative group/nav focus-within:z-20">
            <Link prefetch={false} href={link.href} className="flex items-center gap-1 px-3 py-2 text-sm text-slate-200 hover:text-white rounded-lg hover:bg-white/5" aria-haspopup={link.children ? "menu" : undefined}>
              {link.label}{link.children && <ChevronDown className="w-3.5 h-3.5 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180 transition-transform" aria-hidden="true" />}
            </Link>
            {link.children && <div role="menu" className="invisible opacity-0 translate-y-1 group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-focus-within/nav:translate-y-0 absolute top-full left-0 mt-1 w-60 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden transition-all">
              {link.children.map((child) => <Link prefetch={false} role="menuitem" key={child.label} href={child.href} className="block px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-white/5">{child.label}</Link>)}
            </div>}
          </div>)}
        </div>

        <div className="hidden lg:block"><Link prefetch={false} href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-900/20">Book a Free Call</Link></div>
        <MobileNavigation links={links} />
      </div></div>
    </nav>
  );
}
