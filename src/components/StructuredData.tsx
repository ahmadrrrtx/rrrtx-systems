"use client";

import Script from "next/script";
import { SITE_URL } from "@/lib/site-config";

export function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RRRTX SYSTEMS",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/rrrtx-logo.png`,
    description:
      "Premium custom ecommerce and AI automation systems built from scratch. Engineering-first product studio.",
    sameAs: [
      "https://github.com/ahmadrrrtx",
      "https://www.linkedin.com/in/ahmadrrrtx",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["English"],
      url: `${SITE_URL}/contact`,
    },
    areaServed: {
      "@type": "GeoShape",
      description: "Global",
    },
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "RRRTX SYSTEMS",
    image: `${SITE_URL}/assets/rrrtx-logo.png`,
    url: SITE_URL,
    description:
      "Custom ecommerce websites and AI automation systems built from scratch. Product studio for conversion-focused brands.",
    areaServed: "Global",
    serviceType: [
      "Custom Ecommerce Development",
      "AI Automation & Custom Agents",
      "Lead Generation Systems",
      "Website Rebuilds & CRO",
      "Chatbots & AI Assistants",
      "SEO & AEO",
    ],
    priceRange: "$$$",
    currenciesAccepted: "USD, EUR, GBP, PKR",
    paymentAccepted: "Bank Transfer, Stripe, PayPal",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "RRRTX Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Ecommerce Development",
            description: "Built-from-scratch online stores with real cart logic and conversion architecture.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Automations & Custom Agents",
            description: "Custom agents that monitor, classify, and act on real business data.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Lead Generation Systems",
            description: "Capture, qualify, and route leads automatically.",
          },
        },
      ],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RRRTX SYSTEMS",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you use templates or build from scratch?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We build everything from scratch. No Shopify themes, no WordPress templates, no borrowed code. Every line is custom-architected for your specific business logic and conversion goals.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a custom ecommerce website cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our project-based builds start at $10,000 and typically range to $25,000 depending on catalog size, integrations, and custom features. We provide exact quotes after a discovery phase.",
        },
      },
      {
        "@type": "Question",
        name: "What tech stack do you use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Next.js for frontend, Turso (SQLite) for database, Python for AI/automation, and Vercel or Cloud Run for deployment. We choose tools based on your needs, not trends.",
        },
      },
      {
        "@type": "Question",
        name: "Do I own the code after delivery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. 100% ownership. Source code, database, assets, and deployment config. No vendor lock-in. No hidden dependencies. You can hand it to another developer or continue with us.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a typical project take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Discovery takes 1-2 weeks. A full ecommerce or AI system build typically ships in 6-10 weeks. We set realistic timelines upfront and deliver in milestones.",
        },
      },
      {
        "@type": "Question",
        name: "What are AI automations and custom agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Custom AI agents built with Python and local LLMs like Gemma. They monitor data feeds, classify leads, summarize content, and trigger actions across your stack — without expensive OpenAI API bills. They run on your infrastructure, not someone else's.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
}
