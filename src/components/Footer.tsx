"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LinkedinIcon, GithubIcon, InstagramIcon, FacebookIcon, XIcon, LinkIcon } from "./SocialIcons";

const DEFAULT_LINKEDIN = "https://www.linkedin.com/company/133734086";
const DEFAULT_GITHUB = "https://github.com/ahmadrrrtx";

interface DynamicSocial {
  platform: string;
  url: string;
}

const defaultFooterLinks = {
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
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "GitHub", href: DEFAULT_GITHUB },
    { label: "LinkedIn", href: DEFAULT_LINKEDIN },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

function renderSocialIcon(platform: string) {
  const name = platform.toLowerCase().trim();
  if (name.includes("linkedin")) return <LinkedinIcon className="w-4 h-4" />;
  if (name.includes("github")) return <GithubIcon className="w-4 h-4" />;
  if (name.includes("instagram")) return <InstagramIcon className="w-4 h-4" />;
  if (name.includes("facebook")) return <FacebookIcon className="w-4 h-4" />;
  if (name.includes("twitter") || name.includes("x.com") || name === "x") return <XIcon className="w-4 h-4" />;
  return <LinkIcon className="w-4 h-4" />;
}

export function Footer() {
  const [footerLinks, setFooterLinks] = useState(defaultFooterLinks);
  const [socials, setSocials] = useState<DynamicSocial[]>([
    { platform: "LinkedIn", url: DEFAULT_LINKEDIN },
    { platform: "GitHub", url: DEFAULT_GITHUB },
  ]);
  const [email, setEmail] = useState<string>("admin@rrrtx.com");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        // Load custom social profiles
        if (data.social_profiles) {
          try {
            const parsed = JSON.parse(data.social_profiles);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSocials(parsed);
            }
          } catch (e) {
            console.error("Failed to parse dynamic socials", e);
          }
        }

        // Load custom contact email
        if (data.contact_email) {
          setEmail(data.contact_email);
        }

        // Load dynamic footer links if configured
        let updatedLinks = { ...defaultFooterLinks };
        let hasChanges = false;

        if (data.footer_services_links) {
          try {
            const parsed = JSON.parse(data.footer_services_links);
            if (Array.isArray(parsed)) {
              updatedLinks.Services = parsed;
              hasChanges = true;
            }
          } catch {}
        }

        if (data.footer_company_links) {
          try {
            const parsed = JSON.parse(data.footer_company_links);
            if (Array.isArray(parsed)) {
              updatedLinks.Company = parsed;
              hasChanges = true;
            }
          } catch {}
        }

        if (hasChanges) {
          // Update resource links if we have dynamic socials
          if (data.social_profiles) {
            try {
              const parsed = JSON.parse(data.social_profiles);
              if (Array.isArray(parsed)) {
                const socialFooterLinks = parsed.map((s: any) => ({
                  label: s.platform,
                  href: s.url,
                }));
                updatedLinks.Resources = [
                  ...socialFooterLinks,
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ];
              }
            } catch {}
          }
          setFooterLinks(updatedLinks);
        }
      })
      .catch((err) => console.error(err));
  }, []);

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
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-3">
              Custom ecommerce and AI systems built from scratch for brands that outgrew templates.
            </p>
            {email && (
              <p className="text-xs text-slate-600 mb-4">
                Inquiries: <a href={`mailto:${email}`} className="text-cyan-500 hover:underline">{email}</a>
              </p>
            )}
            <div className="flex items-center gap-3 mt-1">
              {socials.map((s, idx) => (
                <Link
                  key={`${s.platform}-${idx}`}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`RRRTX SYSTEMS on ${s.platform}`}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-600 transition-colors"
                >
                  {renderSocialIcon(s.platform)}
                </Link>
              ))}
            </div>
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
