import { db } from "./db";
import { resources } from "./schema";
import { eq } from "drizzle-orm";

async function seedExtendedResources() {
  console.log("Updating dynamic resources database links...");

  const assets = [
    {
      title: "RRRTX Website Launch & Conversion Checklist",
      description: "A comprehensive 45-point checklist covering core web vitals, speed audits, security, trust indicators, above-the-fold clarity, and checkout optimization to guarantee a high-converting launch.",
      category: "Checklist",
      fileType: "HTML",
      downloadUrl: "/downloads/website-launch-checklist.html",
      isGated: true,
      sortOrder: 1,
    },
    {
      title: "B2B Operations & AI Automation Playbook",
      description: "An operational playbook to identifying high-friction manual tasks inside your agency. Learn exactly how to eliminate Zapier spaghetti, setup error logs, and deploy custom background Python agent nodes.",
      category: "Guide",
      fileType: "HTML",
      downloadUrl: "/downloads/business-automation-checklist.html",
      isGated: true,
      sortOrder: 2,
    },
    {
      title: "B2B Lead Generation & Acquisition Worksheet",
      description: "A conversion-focused client intake blueprint covering multi-step progressive forms, interactive estimation widgets, trust architectures, and automated routing pipelines.",
      category: "Template",
      fileType: "HTML",
      downloadUrl: "/downloads/lead-generation-audit-sheet.html",
      isGated: false,
      sortOrder: 3,
    }
  ];

  for (const asset of assets) {
    // Delete any older mock records first to ensure clean updates
    await db.delete(resources).where(eq(resources.title, asset.title));

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
    console.log(`Extended resource seeded successfully: "${asset.title}"`);
  }

  console.log("Resources database updates completed.");
}

seedExtendedResources().catch((err) => {
  console.error("Resources updating failed:", err);
  process.exit(1);
});
