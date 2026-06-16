import { getSetting } from "./queries";

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Custom Ecommerce", href: "/services/ecommerce" },
      { label: "AI Automations & Agents", href: "/services/ai-automation" },
      { label: "Lead Generation Systems", href: "/services/lead-generation" },
      { label: "Website Rebuilds", href: "/services/rebuilds" },
      { label: "Chatbots & AI Assistants", href: "/services/chatbots" },
      { label: "SEO & AEO", href: "/services/seo" },
    ],
  },
  {
    label: "Tools",
    href: "#",
    children: [
      { label: "Free Audit", href: "/audit" },
      { label: "ROI Calculator", href: "/roi" },
      { label: "Resource Downloads", href: "/resources" },
    ],
  },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const defaultFooterServices = [
  { label: "Custom Ecommerce", href: "/services/ecommerce" },
  { label: "AI Automations & Agents", href: "/services/ai-automation" },
  { label: "Lead Generation", href: "/services/lead-generation" },
  { label: "Website Rebuilds", href: "/services/rebuilds" },
  { label: "Chatbots & AI Assistants", href: "/services/chatbots" },
  { label: "SEO & AEO", href: "/services/seo" },
];

export const defaultFooterCompany = [
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Free Audit", href: "/audit" },
  { label: "ROI Calculator", href: "/roi" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export async function getNavbarLinks(): Promise<NavLink[]> {
  return await getSetting<NavLink[]>("navbar_links", defaultNavLinks);
}

export async function getFooterCompanyLinks(): Promise<{ label: string; href: string }[]> {
  return await getSetting<{ label: string; href: string }[]>("footer_company_links", defaultFooterCompany);
}

export async function getFooterServicesLinks(): Promise<{ label: string; href: string }[]> {
  return await getSetting<{ label: string; href: string }[]>("footer_services_links", defaultFooterServices);
}
