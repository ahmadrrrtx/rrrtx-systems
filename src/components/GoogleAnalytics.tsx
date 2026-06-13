import Script from "next/script";

/**
 * GA4 (gtag.js) loader.
 *
 * Measurement ID is read from the public env var NEXT_PUBLIC_GA_ID so it is
 * never hardcoded as a secret and can be changed without a code edit.
 * Falls back to the known RRRTX SYSTEMS property if the env var is absent so
 * analytics keeps working even before the var is set in Vercel.
 *
 * Renders nothing in development to avoid polluting analytics with local hits.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0C94FXCGHH";

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
