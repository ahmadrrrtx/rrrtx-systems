import { JsonLd } from "./JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/assets/rrrtx-logo.png`,
          width: 177,
          height: 68,
        },
        description:
          "Engineering-first product studio building custom ecommerce platforms, AI automations, and lead generation systems.",
        sameAs: [
          "https://github.com/ahmadrrrtx",
          "https://www.linkedin.com/company/133734086",
          "https://www.instagram.com/rrrtxsystems/",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: ["English"],
          url: `${SITE_URL}/contact`,
        },
        areaServed: "Worldwide",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return <JsonLd id="schema-site-identity" data={data} />;
}
