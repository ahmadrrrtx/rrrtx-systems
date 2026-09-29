import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_CONTENT } from "@/lib/legal-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "The terms that apply to using the RRRTX SYSTEMS website, its free tools and resources, and the Partner Network portal, alongside your project agreement.",
  path: "/terms",
});

export default async function TermsPage() {
  const page = await getContentPage("terms");
  return (
    <LegalPage
      title={page?.title || "Terms of Service"}
      cmsContent={page?.content}
      fallbackContent={TERMS_CONTENT}
    />
  );
}
