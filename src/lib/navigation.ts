import { cache } from "react";
import { getSettings } from "./queries";

export interface NavLink { label: string; href: string; children?: NavLink[] }
export interface SimpleLink { label: string; href: string }
export interface SocialLink { platform: string; url: string }

export const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "/" }, { label: "Work", href: "/work" },
  { label: "Services", href: "/services", children: [
    { label: "Custom Ecommerce", href: "/services/ecommerce" },
    { label: "AI Automations & Agents", href: "/services/ai-automation" },
    { label: "Lead Generation Systems", href: "/services/lead-generation" },
    { label: "Website Rebuilds", href: "/services/rebuilds" },
    { label: "Chatbots & AI Assistants", href: "/services/chatbots" },
    { label: "SEO & AEO", href: "/services/seo" },
  ] },
  { label: "Tools", href: "/resources", children: [
    { label: "Free Audit", href: "/audit" }, { label: "ROI Calculator", href: "/roi" },
    { label: "Resource Downloads", href: "/resources" }, { label: "Open Source", href: "/open-source" },
    { label: "Search", href: "/search" },
  ] },
  { label: "Process", href: "/process" }, { label: "Pricing", href: "/pricing" },
  { label: "Partners", href: "/partners", children: [
    { label: "Partner Network", href: "/partners" },
    { label: "Become a Partner", href: "/partners/apply" },
    { label: "Partner Login", href: "/partner/login" },
    { label: "Verify a Certificate", href: "/verify" },
  ] },
  { label: "Blog", href: "/blog" }, { label: "About", href: "/about" },
];

export const defaultFooterServices: SimpleLink[] = [
  { label: "Custom Ecommerce", href: "/services/ecommerce" },
  { label: "AI Automations & Agents", href: "/services/ai-automation" },
  { label: "Lead Generation", href: "/services/lead-generation" },
  { label: "Website Rebuilds", href: "/services/rebuilds" },
  { label: "Chatbots & AI Assistants", href: "/services/chatbots" },
  { label: "SEO & AEO", href: "/services/seo" },
];

export const defaultFooterCompany: SimpleLink[] = [
  { label: "Work", href: "/work" }, { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" }, { label: "Partners", href: "/partners" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" }, { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" }, { label: "Search", href: "/search" },
];

export const defaultFooterPartner: SimpleLink[] = [
  { label: "Partner Network", href: "/partners" },
  { label: "Become a Partner", href: "/partners/apply" },
  { label: "Partner Login", href: "/partner/login" },
  { label: "Verify a Certificate", href: "/verify" },
];

const defaultSocials: SocialLink[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/133734086" },
  { platform: "GitHub", url: "https://github.com/ahmadrrrtx" },
];

function safeHref(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; }
}
function normalizeLinks(value: unknown, fallback: NavLink[]): NavLink[] {
  if (!Array.isArray(value)) return fallback;
  const links = value.flatMap((item): NavLink[] => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as { label?: unknown; href?: unknown; children?: unknown };
    if (typeof candidate.label !== "string" || !safeHref(candidate.href)) return [];
    const children = candidate.children === undefined ? undefined : normalizeLinks(candidate.children, []);
    return [{ label: candidate.label.slice(0, 80), href: candidate.href, ...(children?.length ? { children } : {}) }];
  });
  return links.length ? links : fallback;
}

export const getPublicChrome = cache(async () => {
  const defaults = {
    navbar_links: defaultNavLinks,
    footer_services_links: defaultFooterServices,
    footer_company_links: defaultFooterCompany,
    footer_partner_links: defaultFooterPartner,
    social_profiles: defaultSocials,
    contact_email: "contact@rrrtx-systems.com",
  };
  const raw = !process.env.TURSO_DATABASE_URL && process.env.NODE_ENV === "production"
    ? defaults
    : await getSettings(defaults);
  const socials = Array.isArray(raw.social_profiles)
    ? raw.social_profiles.filter((item): item is SocialLink => Boolean(item && typeof item === "object" && typeof (item as SocialLink).platform === "string" && safeHref((item as SocialLink).url)))
    : defaultSocials;
  return {
    navbar_links: normalizeLinks(raw.navbar_links, defaultNavLinks),
    footer_services_links: normalizeLinks(raw.footer_services_links, defaultFooterServices),
    footer_company_links: normalizeLinks(raw.footer_company_links, defaultFooterCompany),
    footer_partner_links: normalizeLinks(raw.footer_partner_links, defaultFooterPartner),
    social_profiles: socials.length ? socials : defaultSocials,
    contact_email: typeof raw.contact_email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.contact_email) ? raw.contact_email : defaults.contact_email,
  };
});

export async function getNavbarLinks() { return (await getPublicChrome()).navbar_links; }
export async function getFooterCompanyLinks() { return (await getPublicChrome()).footer_company_links; }
export async function getFooterServicesLinks() { return (await getPublicChrome()).footer_services_links; }
