import { db } from "./db";
import { resources } from "./schema";
import { eq } from "drizzle-orm";

async function seedResources() {
  console.log("Seeding downloadable resource assets...");

  const assets = [
    {
      title: "RRRTX Website Launch & Conversion Checklist",
      description: "A comprehensive 45-point checklist covering core web vitals, speed audits, security, trust indicators, above-the-fold clarity, and checkout optimization to guarantee a high-converting launch.",
      category: "Checklist",
      fileType: "PDF",
      downloadUrl: "https://github.com/ahmadrrrtx/rrrtx-systems/raw/main/README.md", // placeholder file path, safe for demo
      isGated: true,
      coverImageUrl: "",
      sortOrder: 1,
    },
    {
      title: "Operational Automation Opportunity Map",
      description: "An operational guide to identifying high-friction manual tasks inside your agency. Learn exactly which CRM, scheduling, and follow-up tasks to automate first to reclaim 20+ hours per week.",
      category: "Guide",
      fileType: "PDF",
      downloadUrl: "https://github.com/ahmadrrrtx/rrrtx-systems/raw/main/README.md",
      isGated: true,
      coverImageUrl: "",
      sortOrder: 2,
    },
    {
      title: "Custom NextJS Performance Benchmarking Sheet",
      description: "An open, ungated spreadsheet mapping Core Web Vitals (LCP, FID, CLS) benchmarks against standard WordPress / Shopify themes vs modern React-based headless stacks.",
      category: "Template",
      fileType: "XLSX",
      downloadUrl: "https://github.com/ahmadrrrtx/rrrtx-systems/raw/main/README.md",
      isGated: false,
      coverImageUrl: "",
      sortOrder: 3,
    }
  ];

  for (const asset of assets) {
    const existing = await db.select().from(resources).where(eq(resources.title, asset.title)).limit(1);
    if (existing.length === 0) {
      await db.insert(resources).values({
        title: asset.title,
        description: asset.description,
        category: asset.category,
        fileType: asset.fileType,
        downloadUrl: asset.downloadUrl,
        isGated: asset.isGated,
        isActive: true,
        sortOrder: asset.sortOrder,
        createdAt: new Date(),
      });
      console.log(`Resource seeded: "${asset.title}"`);
    } else {
      console.log(`Resource already exists: "${asset.title}"`);
    }
  }

  console.log("Seeding resources complete.");
}

seedResources().catch((err) => {
  console.error("Seeding resources failed:", err);
  process.exit(1);
});
