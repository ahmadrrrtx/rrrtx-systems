// Portal layout — enforces partner auth AND completed onboarding (signed agreement).
// Defense-in-depth on top of proxy.ts; the server re-derives identity from the session.

import { redirect } from "next/navigation";
import { getPartnerSession } from "@/lib/partner-session";
import { hasPartnerSignedVersion } from "@/lib/partner-data";
import { AGREEMENT_VERSION } from "@/lib/partner-agreement";
import { PartnerLayout } from "@/components/PartnerLayout";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  const signed = await hasPartnerSignedVersion(session.partnerId, AGREEMENT_VERSION);
  if (!signed) redirect("/partner/agreement");

  return <PartnerLayout>{children}</PartnerLayout>;
}
