"use client";

import { Suspense, useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { AnalyticsClient } from "./AnalyticsClient";
import { CONSENT_EVENT, getConsent, isPrivateSurface, type ConsentState } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0C94FXCGHH";

/**
 * Google Analytics 4 loader.
 *
 * Two gates must both pass before any Google script is requested:
 *
 *  1. Consent — analytics is non-essential and sets cookies, so nothing is
 *     loaded until the visitor has explicitly accepted. Declining means the
 *     googletagmanager.com script is never fetched at all.
 *  2. Idle deferral — even with consent, loading waits for the first user
 *     interaction (or 20s) so analytics never competes with the page for
 *     bandwidth during load.
 *
 * Consent is re-read live, so withdrawing it in the footer stops analytics for
 * subsequent navigation without a reload.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  const [touched, setTouched] = useState(false);

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

  useEffect(() => {
    if (!consented) return;
    const activate = () => setTouched(true);
    const options: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", activate, options);
    window.addEventListener("keydown", activate, options);
    window.addEventListener("scroll", activate, options);
    const timer = window.setTimeout(activate, 20_000);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
      window.removeEventListener("scroll", activate);
    };
  }, [consented]);

  // The dashboard and partner portal are private: their URLs can contain record
  // identifiers, so no analytics script is loaded there even after consent.
  if (!consented || !touched || isPrivateSurface(pathname) || process.env.NODE_ENV !== "production" || !GA_ID) return null;

  return (
    <>
      <Script id="ga4-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        // Consent Mode defaults: deny until the visitor opts in.
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'granted'
        });
        gtag('config', '${GA_ID}', { send_page_view: false });
      `}</Script>
      <Suspense fallback={null}><AnalyticsClient /></Suspense>
    </>
  );
}
