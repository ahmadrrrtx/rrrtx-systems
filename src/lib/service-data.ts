export type ServiceDetail = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  features: string[];
  image: string;
};

export const serviceData: Record<string, Omit<ServiceDetail, "slug">> = {
  ecommerce: {
    title: "Custom Ecommerce",
    headline: "Stores That Sell. Not Just Look Good.",
    description:
      "We build ecommerce platforms from scratch — no generic themes or plugin stacks. Your storefront, cart logic, checkout flow, payment integrations, and operating dashboard are designed around the way your business actually sells.",
    features: [
      "Custom Next.js storefront engineered for speed",
      "Cart and checkout logic matched to your business",
      "Stripe, PayPal, and local payment integrations",
      "Inventory and order management workflows",
      "WhatsApp and messaging notifications",
      "Mobile-first Core Web Vitals optimization",
      "Search-ready product and category architecture",
    ],
    image: "/assets/abstract-commerce-grid.webp",
  },
  "ai-automation": {
    title: "AI Automations & Agents",
    headline: "Intelligence That Works While You Sleep.",
    description:
      "We engineer reliable AI-assisted workflows that monitor, classify, summarize, and act on business data. Each system is designed around measurable operations, explicit guardrails, observable failures, and infrastructure you control.",
    features: [
      "Local and hosted language-model integrations",
      "RSS, inbox, database, and API monitoring",
      "Slack, email, and CRM workflows",
      "Classification and summarization pipelines",
      "Human approval and escalation controls",
      "Monitoring, retries, and failure visibility",
      "Full code ownership and auditability",
    ],
    image: "/assets/ai-agent-network.webp",
  },
  "lead-generation": {
    title: "Lead Generation Systems",
    headline: "Capture. Qualify. Convert. Automatically.",
    description:
      "We build end-to-end lead systems that capture intent, qualify enquiries, route opportunities, and preserve source attribution. The workflow lives inside your digital platform instead of depending on a disconnected collection of widgets.",
    features: [
      "Accessible multi-step and progressive forms",
      "Transparent lead qualification rules",
      "CRM routing and team notifications",
      "Email, SMS, and WhatsApp follow-up",
      "Landing-page and CTA experimentation",
      "Funnel analytics and source attribution",
      "Privacy-conscious data collection",
    ],
    image: "/assets/hero-core-visual.webp",
  },
  rebuilds: {
    title: "Website Rebuilds & Conversion Upgrades",
    headline: "Fix What's Broken. Scale What Works.",
    description:
      "We audit underperforming journeys, preserve what already works, and improve the weakest technical and conversion layers incrementally. The result is a faster, clearer platform without an unnecessary all-at-once rewrite.",
    features: [
      "Conversion and technical baseline audit",
      "Above-the-fold messaging refinement",
      "Checkout and form friction reduction",
      "Mobile experience improvements",
      "Core Web Vitals remediation",
      "Measurement and experiment foundations",
      "SEO and structured-data remediation",
    ],
    image: "/assets/gradient-ambient-bg.webp",
  },
  chatbots: {
    title: "Chatbots & AI Assistants",
    headline: "Useful Answers. Clear Guardrails. Human Handoff.",
    description:
      "We build assistants grounded in approved business knowledge. They answer common questions, guide visitors to useful content, disclose their automated nature, and escalate when a human should take over.",
    features: [
      "Retrieval grounded in approved content",
      "Multi-turn conversation context",
      "Human handoff with conversation history",
      "Web and messaging-channel deployment",
      "Brand voice and response guardrails",
      "Resolution and escalation analytics",
      "Privacy, retention, and quality controls",
    ],
    image: "/assets/hero-holographic-hand.webp",
  },
  seo: {
    title: "SEO & AEO",
    headline: "Earn Visibility With Technical Clarity and Real Expertise.",
    description:
      "We improve the technical, semantic, and editorial foundations that help search engines and answer systems discover, understand, and cite your work. The focus is useful content, accurate entities, crawlability, and measurable business outcomes.",
    features: [
      "Technical SEO and indexation remediation",
      "Page-specific Schema.org structured data",
      "Core Web Vitals optimization",
      "Topic and internal-link architecture",
      "AI search and answer-engine discoverability",
      "Content quality and evidence workflows",
      "Search Console and conversion reporting",
    ],
    image: "/assets/gradient-ambient-bg.webp",
  },
};

export function mergeServiceDetail(
  slug: string,
  dbService?: {
    title: string;
    shortDescription: string | null;
    fullDescription: string | null;
  } | null
): ServiceDetail | null {
  const fallback = serviceData[slug];
  if (!fallback && !dbService) return null;

  const usefulFullDescription =
    dbService?.fullDescription &&
    dbService.fullDescription.trim().length > 40 &&
    dbService.fullDescription.trim() !== "..."
      ? dbService.fullDescription.trim()
      : null;

  return {
    slug,
    title: dbService?.title || fallback?.title || slug,
    headline:
      dbService?.shortDescription ||
      fallback?.headline ||
      "A custom system designed around your business goals.",
    description:
      usefulFullDescription ||
      fallback?.description ||
      dbService?.shortDescription ||
      "We scope, design, engineer, deploy, and improve a production system around your requirements.",
    features:
      fallback?.features || [
        "Discovery and requirements mapping",
        "Architecture and implementation",
        "Testing and production deployment",
        "Documentation and full ownership",
        "Post-launch measurement and support",
      ],
    image: fallback?.image || "/assets/hero-core-visual.webp",
  };
}
