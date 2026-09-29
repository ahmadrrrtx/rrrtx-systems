import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { COOKIES_CONTENT } from "@/lib/legal-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description:
    "The cookies and similar technologies used on rrrtx-systems.com: which are strictly necessary, which are analytics-only and set solely with your consent, and how to change your choice.",
  path: "/cookies",
});

export default async function CookiesPage() {
  const page = await getContentPage("cookies");
  return (
    <LegalPage
      title={page?.title || "Cookie Policy"}
      cmsContent={page?.content}
      fallbackContent={COOKIES_CONTENT}
    />
  );
}
