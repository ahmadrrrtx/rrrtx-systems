import { db } from "./db";
import { posts, resources } from "./schema";
import * as fs from "fs";

async function exportSql() {
  console.log("Exporting Turso seed SQL script...");

  const sqlStatements: string[] = [];

  // 1. Create table queries
  sqlStatements.push(`-- RRRTX SYSTEMS - TURSO DATABASE SETUP & SEEDING SCRIPT
-- RUN THIS ENTIRE SCRIPT IN YOUR TURSO CONSOLE TO CREATE AND SEED BLOGS AND RESOURCES!

-- A. Table Creation Queries
CREATE TABLE IF NOT EXISTS \`posts\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`slug\` TEXT NOT NULL UNIQUE,
  \`title\` TEXT NOT NULL,
  \`excerpt\` TEXT,
  \`content\` TEXT NOT NULL,
  \`cover_image_url\` TEXT,
  \`tags\` TEXT,
  \`meta_title\` TEXT,
  \`meta_description\` TEXT,
  \`status\` TEXT DEFAULT 'draft',
  \`published_at\` INTEGER,
  \`created_at\` INTEGER,
  \`updated_at\` INTEGER
);

CREATE TABLE IF NOT EXISTS \`resources\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`title\` TEXT NOT NULL,
  \`description\` TEXT,
  \`cover_image_url\` TEXT,
  \`category\` TEXT,
  \`file_type\` TEXT,
  \`download_url\` TEXT NOT NULL,
  \`is_gated\` INTEGER DEFAULT 1,
  \`is_active\` INTEGER DEFAULT 1,
  \`sort_order\` INTEGER DEFAULT 0,
  \`created_at\` INTEGER
);

CREATE TABLE IF NOT EXISTS \`gated_leads\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`email\` TEXT NOT NULL,
  \`resource_id\` INTEGER NOT NULL,
  \`created_at\` INTEGER
);

CREATE TABLE IF NOT EXISTS \`audit_submissions\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT NOT NULL,
  \`email\` TEXT NOT NULL,
  \`website_url\` TEXT NOT NULL,
  \`business_type\` TEXT,
  \`help_with\` TEXT,
  \`scores\` TEXT,
  \`recommendations\` TEXT,
  \`created_at\` INTEGER
);

CREATE TABLE IF NOT EXISTS \`calculator_submissions\` (
  \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
  \`name\` TEXT,
  \`email\` TEXT,
  \`monthly_leads\` INTEGER,
  \`conversion_rate\` REAL,
  \`average_value\` REAL,
  \`current_revenue\` REAL,
  \`time_spent_manual\` REAL,
  \`cost_manual\` REAL,
  \`expected_improvement\` REAL,
  \`results\` TEXT,
  \`created_at\` INTEGER
);

-- Delete old seeds to prevent duplication errors on re-run
DELETE FROM \`posts\` WHERE \`slug\` IN ('custom-ecommerce-vs-templates', 'operational-workflow-automation', 'improve-website-conversion-rate');
DELETE FROM \`resources\` WHERE \`title\` IN ('RRRTX Website Launch & Conversion Checklist', 'B2B Operations & AI Automation Playbook', 'B2B Lead Generation & Acquisition Worksheet');
`);

  // 2. Query posts from local db
  const blogRows = await db.select().from(posts);
  sqlStatements.push("\n-- B. Seed Blog Posts");
  blogRows.forEach((row) => {
    const slug = row.slug;
    const title = row.title.replace(/'/g, "''");
    const excerpt = (row.excerpt || "").replace(/'/g, "''");
    const content = row.content.replace(/'/g, "''");
    const cover_image_url = row.coverImageUrl || "";
    const tags = row.tags || "";
    const meta_title = (row.metaTitle || "").replace(/'/g, "''");
    const meta_description = (row.metaDescription || "").replace(/'/g, "''");
    const status = row.status || "published";
    
    // SQLite timestamps are unix timestamps or integers
    const published_at = row.publishedAt ? row.publishedAt.getTime() : Date.now();
    const created_at = row.createdAt ? row.createdAt.getTime() : Date.now();
    const updated_at = row.updatedAt ? row.updatedAt.getTime() : Date.now();

    sqlStatements.push(`INSERT INTO \`posts\` (\`slug\`, \`title\`, \`excerpt\`, \`content\`, \`cover_image_url\`, \`tags\`, \`meta_title\`, \`meta_description\`, \`status\`, \`published_at\`, \`created_at\`, \`updated_at\`) VALUES ('${slug}', '${title}', '${excerpt}', '${content}', '${cover_image_url}', '${tags}', '${meta_title}', '${meta_description}', '${status}', ${published_at}, ${created_at}, ${updated_at});`);
  });

  // 3. Query resources from local db
  const resRows = await db.select().from(resources);
  sqlStatements.push("\n-- C. Seed Resources & Checklists");
  resRows.forEach((row) => {
    const title = row.title.replace(/'/g, "''");
    const description = (row.description || "").replace(/'/g, "''");
    const cover_image_url = row.coverImageUrl || "";
    const category = row.category || "Guide";
    const file_type = row.fileType || "HTML";
    const download_url = row.downloadUrl;
    const is_gated = row.isGated ? 1 : 0;
    const is_active = row.isActive ? 1 : 0;
    const sort_order = row.sortOrder || 0;
    const created_at = row.createdAt ? row.createdAt.getTime() : Date.now();

    sqlStatements.push(`INSERT INTO \`resources\` (\`title\`, \`description\`, \`cover_image_url\`, \`category\`, \`file_type\`, \`download_url\`, \`is_gated\`, \`is_active\`, \`sort_order\`, \`created_at\`) VALUES ('${title}', '${description}', '${cover_image_url}', '${category}', '${file_type}', '${download_url}', ${is_gated}, ${is_active}, ${sort_order}, ${created_at});`);
  });

  // Write file
  fs.writeFileSync("turso_setup.sql", sqlStatements.join("\n"));
  console.log("Turso SQL Setup script successfully written to 'turso_setup.sql'!");
}

exportSql().catch((err) => console.error(err));
