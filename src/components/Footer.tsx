import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPublicChrome } from "@/lib/navigation";
import { LinkedinIcon, GithubIcon, InstagramIcon, FacebookIcon, XIcon, LinkIcon } from "./SocialIcons";
import { CookieSettingsLink } from "./CookieConsent";

function socialIcon(platform: string) {
  const name = platform.toLowerCase();
  if (name.includes("linkedin")) return <LinkedinIcon className="w-4 h-4" />;
  if (name.includes("github")) return <GithubIcon className="w-4 h-4" />;
  if (name.includes("instagram")) return <InstagramIcon className="w-4 h-4" />;
  if (name.includes("facebook")) return <FacebookIcon className="w-4 h-4" />;
  if (name.includes("twitter") || name === "x") return <XIcon className="w-4 h-4" />;
  return <LinkIcon className="w-4 h-4" />;
}

/**
 * Footer v3 — upgraded information architecture on the same data contract:
 * navbar/footer link groups and socials still come from getPublicChrome()
 * (admin-editable), all original destinations preserved.
 */
export async function Footer() {
  const chrome = await getPublicChrome();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#020617]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-violet-500/30" aria-hidden="true" />
      <div className="soft-grid absolute inset-0 opacity-25" aria-hidden="true" />

      {/* ── CTA row ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-8 border-b border-white/[0.07] py-14">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Build systems that work <span className="text-gradient">beyond the screen.</span>
            </h2>
            <p className="mt-2.5 text-sm text-slate-400">Tell us the outcome — we&rsquo;ll map the system that gets you there.</p>
          </div>
          <Link
            prefetch={false}
            href="/contact"
            className="premium-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white"
          >
            Book a Strategy Call <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* ── Link columns ── */}
        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/assets/rrrtx-logo.png" alt="" fill sizes="32px" className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white leading-none">RRRTX</span>
                <span className="text-[9px] tracking-[0.3em] text-slate-300 uppercase mt-0.5">Systems</span>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400 mb-4">
              Custom ecommerce and AI systems built around real business logic, measurable outcomes, and full ownership.
            </p>
            <p className="mb-4 flex flex-col gap-2 text-xs text-slate-400">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1.5 font-mono text-[10px] tracking-wide text-emerald-300">
                <span className="h-[6px] w-[6px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" aria-hidden="true" />
                All systems operational
              </span>
              <span>
                Inquiries:{" "}
                <a href={`mailto:${chrome.contact_email}`} className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                  {chrome.contact_email}
                </a>
              </span>
            </p>
            <div className="flex items-center gap-3">
              {chrome.social_profiles.map((social) => (
                <a
                  key={`${social.platform}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`RRRTX Systems on ${social.platform}`}
                  className="premium-card group/social inline-flex h-10 w-10 items-center justify-center rounded-xl border-slate-700/65 text-slate-300 hover:text-cyan-300"
                >
                  {socialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Services">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-300">Services</h2>
            <ul className="space-y-2.5">
              {chrome.footer_services_links.map((link) => (
                <li key={`svc-${link.label}-${link.href}`}>
                  <Link prefetch={false} href={link.href} className="footer-link text-sm text-slate-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-300">Company</h2>
            <ul className="space-y-2.5">
              {chrome.footer_company_links.map((link) => (
                <li key={`co-${link.label}-${link.href}`}>
                  <Link prefetch={false} href={link.href} className="footer-link text-sm text-slate-400">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Partners and legal">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-300">Partners</h2>
            <ul className="space-y-2.5">
              {chrome.footer_partner_links.map((link) => (
                <li key={`pt-${link.label}-${link.href}`}>
                  <Link prefetch={false} href={link.href} className="footer-link text-sm text-slate-400">{link.label}</Link>
                </li>
              ))}
              <li>
                <Link prefetch={false} href="/open-source" className="footer-link text-sm text-slate-400">Open Source</Link>
              </li>
            </ul>
            <h2 className="mb-4 mt-7 text-xs font-semibold uppercase tracking-wider text-slate-300">Legal</h2>
            <ul className="space-y-2.5">
              <li><Link prefetch={false} href="/privacy" className="footer-link text-sm text-slate-400">Privacy Policy</Link></li>
              <li><Link prefetch={false} href="/terms" className="footer-link text-sm text-slate-400">Terms of Service</Link></li>
              <li><Link prefetch={false} href="/cookies" className="footer-link text-sm text-slate-400">Cookie Policy</Link></li>
              <li><Link prefetch={false} href="/refunds" className="footer-link text-sm text-slate-400">Refund Policy</Link></li>
            </ul>
          </nav>
        </div>

        {/* ── Meta row ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 py-6 sm:flex-row">
          <p className="text-xs text-slate-400">© {year} RRRTX SYSTEMS. All rights reserved.</p>
          <p className="flex items-center gap-3 text-xs text-slate-400">
            <CookieSettingsLink className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200" />
            <span aria-hidden="true">·</span>
            <span>Built with Next.js, Tailwind, and intention.</span>
          </p>
        </div>
      </div>

      {/* ── Neon brand band — full-bleed, runs to the bottom edge ── */}
      <div className="relative mt-6">
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
