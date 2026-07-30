"use client";

import { Suspense, useEffect, useState } from "react";
import Script from "next/script";
import { AnalyticsClient } from "./AnalyticsClient";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0C94FXCGHH";

export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !GA_ID) return;
    const activate = () => setEnabled(true);
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
  }, []);

  if (!enabled || process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      <Script id="ga4-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: false });
      `}</Script>
      <Suspense fallback={null}><AnalyticsClient /></Suspense>
    </>
  );
}
