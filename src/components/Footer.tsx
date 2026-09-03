import Link from "next/link";
import Image from "next/image";
import { getPublicChrome } from "@/lib/navigation";
import { LinkedinIcon, GithubIcon, InstagramIcon, FacebookIcon, XIcon, LinkIcon } from "./SocialIcons";

function socialIcon(platform: string) {
  const name = platform.toLowerCase();
  if (name.includes("linkedin")) return <LinkedinIcon className="w-4 h-4" />;
  if (name.includes("github")) return <GithubIcon className="w-4 h-4" />;
  if (name.includes("instagram")) return <InstagramIcon className="w-4 h-4" />;
  if (name.includes("facebook")) return <FacebookIcon className="w-4 h-4" />;
  if (name.includes("twitter") || name === "x") return <XIcon className="w-4 h-4" />;
  return <LinkIcon className="w-4 h-4" />;
}

export async function Footer() {
  const chrome = await getPublicChrome();
  const columns = {
    Services: chrome.footer_services_links,
    Partners: chrome.footer_partner_links,
    Company: chrome.footer_company_links,
    Resources: [
      ...chrome.social_profiles.map((social) => ({ label: social.platform, href: social.url })),
      { label: "Open Source", href: "/open-source" }, { label: "Privacy Policy", href: "/privacy" }, { label: "FAQ", href: "/faq" }, { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#020617] pt-16">
      <div className="soft-grid absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-40 w-[720px] -translate-x-1/2 rounded-full bg-blue-500/[0.045] blur-[90px]" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-1"><div className="flex items-center gap-2 mb-4"><div className="relative w-7 h-7"><Image src="/assets/rrrtx-logo.png" alt="" fill sizes="28px" className="object-contain" /></div><div className="flex flex-col"><span className="text-sm font-bold text-white leading-none">RRRTX</span><span className="text-[9px] tracking-[0.3em] text-slate-300 uppercase mt-0.5">Systems</span></div></div><p className="text-sm text-slate-300 leading-relaxed max-w-xs mb-3">Custom ecommerce and AI systems built around real business logic, measurable outcomes, and full ownership.</p><p className="text-xs text-slate-300 mb-4">Inquiries: <a href={`mailto:${chrome.contact_email}`} className="text-cyan-300 underline underline-offset-2">{chrome.contact_email}</a></p><div className="flex items-center gap-3">{chrome.social_profiles.map((social) => <a key={`${social.platform}-${social.url}`} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`RRRTX Systems on ${social.platform}`} className="premium-card group/social inline-flex h-10 w-10 items-center justify-center rounded-xl border-slate-700/65 text-slate-300 hover:text-cyan-300">{socialIcon(social.platform)}</a>)}</div></div>
          {Object.entries(columns).map(([category, links]) => <div key={category}><h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">{category}</h2><ul className="space-y-2.5">{links.map((link) => <li key={`${category}-${link.label}-${link.href}`}><Link prefetch={false} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="inline-block text-sm text-slate-300 transition-[color,transform] duration-200 ease-[var(--ease-premium)] hover:translate-x-0.5 hover:text-cyan-300">{link.label}</Link></li>)}</ul></div>)}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"><p className="text-xs text-slate-300">© {new Date().getFullYear()} RRRTX SYSTEMS. All rights reserved.</p><p className="text-xs text-slate-300">Built with Next.js, Tailwind, and intention.</p></div>
      </div>

      {/* ── Neon brand band — full-bleed, runs to the bottom edge ── */}
      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" aria-hidden="true" />
        <div className="rrrtx-neon-halo pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-48 w-[min(760px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 blur-[100px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(56,189,248,0.18),rgba(139,92,246,0.10)_55%,transparent_78%)]" />
        </div>
        <div className="relative flex flex-col items-center gap-2.5 pb-10 pt-12">
          <span className="rrrtx-neon-mark select-none text-4xl font-extrabold tracking-[0.32em] pl-[0.32em] sm:text-6xl sm:tracking-[0.36em] sm:pl-[0.36em]" aria-hidden="true">
            RRRTX
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.6em] pl-[0.6em] text-slate-500">
            Systems
          </span>
        </div>
      </div>
    </footer>
  );
}
