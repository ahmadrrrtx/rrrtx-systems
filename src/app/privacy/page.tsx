import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY_CONTENT } from "@/lib/legal-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "What information RRRTX SYSTEMS collects through this website, why we collect it, how long we keep it, who processes it, and the choices available to you.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const page = await getContentPage("privacy");
  return (
    <LegalPage
      title={page?.title || "Privacy Policy"}
      cmsContent={page?.content}
      fallbackContent={PRIVACY_CONTENT}
    />
  );
}
