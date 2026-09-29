"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { CONSENT_EVENT, getConsent, isPrivateSurface, type ConsentState } from "@/lib/consent";

/**
 * Vercel Web Analytics loader.
 *
 * It is cookeless and aggregate, but it is still non-essential measurement, so
 * it follows exactly the same rule as Google Analytics: nothing is requested
 * until the visitor has explicitly accepted, and declining means the script is
 * never fetched. It is also skipped on the private dashboard/partner surfaces,
 * where page URLs can contain record identifiers.
 */
export function VercelAnalytics() {
  const [consented, setConsented] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sync = (detail?: ConsentState | null) => {
      setConsented(detail ? detail.analytics : Boolean(getConsent()?.analytics));
    };
    sync();

    const onConsentChange = (event: Event) => {
      sync((event as CustomEvent<ConsentState | null>).detail ?? null);
    };
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  if (!consented || isPrivateSurface(pathname)) return null;

  return <Analytics />;
}
