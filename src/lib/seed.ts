import { db } from "./db";
import { leads, services, pricingTiers, projects, users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Seed admin user
  const adminEmail = "admin@rrrtx.com";
  const existing = await db.select().from(users).where(eq(users.email, adminEmail));
  if (existing.length === 0) {
    const hash = await bcrypt.hash("rrrtx2024", 10);
    await db.insert(users).values({
      email: adminEmail,
      passwordHash: hash,
      role: "admin",
    });
    console.log("Admin user created:", adminEmail);
  }

  // Seed services
  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        slug: "ecommerce",
        title: "Custom Ecommerce",
        shortDescription: "Built-from-scratch online stores with real cart logic and conversion architecture.",
        fullDescription: "...",
        iconName: "ShoppingCart",
        isPrimary: true,
        sortOrder: 1,
      },
      {
        slug: "ai-automation",
        title: "AI Automations & Agents",
        shortDescription: "Custom agents that monitor, classify, summarize, and act on real business data.",
        fullDescription: "...",
        iconName: "Bot",
        isPrimary: true,
        sortOrder: 2,
      },
      {
        slug: "lead-generation",
        title: "Lead Generation Systems",
        shortDescription: "Capture, qualify, and route leads automatically.",
        fullDescription: "...",
        iconName: "Target",
        isPrimary: true,
        sortOrder: 3,
      },
      {
        slug: "rebuilds",
        title: "Website Rebuilds & Conversion Upgrades",
        shortDescription: "Audit, rebuild, and optimize — turning dead traffic into qualified leads.",
        fullDescription: "...",
        iconName: "RefreshCw",
        isPrimary: false,
        sortOrder: 4,
      },
      {
        slug: "chatbots",
        title: "Chatbots & AI Assistants",
        shortDescription: "Context-aware chatbots trained on your business data.",
        fullDescription: "...",
        iconName: "MessageSquare",
        isPrimary: false,
        sortOrder: 5,
      },
      {
        slug: "seo",
        title: "SEO & AEO",
        shortDescription: "Technical SEO and Answer Engine Optimization built into your site architecture.",
        fullDescription: "...",
        iconName: "Search",
        isPrimary: false,
        sortOrder: 6,
      },
    ]);
    console.log("Services seeded.");
  }

  // Seed pricing tiers
  const existingTiers = await db.select().from(pricingTiers);
  if (existingTiers.length === 0) {
    await db.insert(pricingTiers).values([
      {
        slug: "discovery",
        title: "Discovery & Strategy",
        subtitle: "Best when you need clarity before building.",
        startingPrice: "$500 – $2,500",
        description: "Full audit, architecture plan, and roadmap.",
        features: JSON.stringify(["Full stack & conversion audit", "Competitive & UX analysis", "Technical architecture plan", "AI automation opportunity map", "Roadmap & budget estimate"]),
        sortOrder: 1,
      },
      {
        slug: "project",
        title: "Project-Based Build",
        subtitle: "Best for one-time ecommerce or AI system builds.",
        startingPrice: "$10,000 – $25,000",
        description: "Custom codebase from scratch with QA and launch support.",
        features: JSON.stringify(["Custom codebase from scratch", "Database & API architecture", "Payment & integration setup", "AI agent or automation logic", "QA, testing & launch support", "30-day post-launch optimization"]),
        sortOrder: 2,
      },
      {
        slug: "retainer",
        title: "Retainer & Growth",
        subtitle: "Best for ongoing optimization and expansion.",
        startingPrice: "$800+ / month",
        description: "Monthly CRO, feature additions, and priority support.",
        features: JSON.stringify(["Monthly CRO & A/B testing", "Feature additions & updates", "AI model tuning & retraining", "Performance monitoring & alerts", "Priority support & fast turnaround", "Quarterly growth strategy reviews"]),
        sortOrder: 3,
      },
    ]);
    console.log("Pricing tiers seeded.");
  }

  // Seed sample lead
  const existingLeads = await db.select().from(leads);
  if (existingLeads.length === 0) {
    await db.insert(leads).values({
      name: "Test Lead",
      email: "test@example.com",
      company: "Test Company",
      service: "Custom Ecommerce",
      budget: "$10,000 – $25,000",
      message: "I need a custom ecommerce store built from scratch. Looking to launch in 8 weeks.",
      status: "new",
      source: "website",
    });
    console.log("Sample lead created.");
  }

  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
