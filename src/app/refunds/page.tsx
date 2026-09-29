import type { Metadata } from "next";
import { getContentPage } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { REFUNDS_CONTENT } from "@/lib/legal-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Refund & Cancellation Policy",
  description:
    "How deposits, milestone payments, cancellations, third-party costs and refunds work for RRRTX SYSTEMS custom engineering engagements.",
  path: "/refunds",
});

export default async function RefundsPage() {
  const page = await getContentPage("refunds");
  return (
    <LegalPage
      title={page?.title || "Refund & Cancellation Policy"}
      cmsContent={page?.content}
      fallbackContent={REFUNDS_CONTENT}
    />
  );
}
