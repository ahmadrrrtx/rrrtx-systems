import { cache } from "react";
import { db } from "./db";
import { services, projects, pricingTiers, testimonials, teamMembers, contentPages, posts, siteSettings, resources } from "./schema";
import { eq, and, asc, desc, lte } from "drizzle-orm";

/**
 * Safe, server-side data fetchers for the PUBLIC site.
 *
 * Every function is wrapped in try/catch and returns an empty array on error.
 * This guarantees the public site (and the production build) never crashes if a
 * table is missing, the DB is briefly unreachable, or migrations are pending.
 *
 * Callers should fall back to their existing hardcoded defaults when these
 * return an empty array, so the design never regresses.
 */

export type DbService = typeof services.$inferSelect;
export type DbProject = typeof projects.$inferSelect;
export type DbPricingTier = typeof pricingTiers.$inferSelect;
export type DbTestimonial = typeof testimonials.$inferSelect;
export type DbTeamMember = typeof teamMembers.$inferSelect;

export async function getPublicServices(opts?: { primaryOnly?: boolean }): Promise<DbService[]> {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(asc(services.sortOrder));
    return opts?.primaryOnly ? rows.filter((s) => s.isPrimary) : rows;
  } catch (error) {
    console.error("getPublicServices error:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<DbService | null> {
  try {
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getServiceBySlug error:", error);
    return null;
  }
}

export async function getSettings<T extends Record<string, unknown>>(
  defaults: T
): Promise<T> {
  try {
    const rows = await db.select().from(siteSettings);
    const result: Record<string, unknown> = { ...defaults };
    for (const row of rows) {
      if (row.value === null) continue;
      try {
        result[row.key] = JSON.parse(row.value);
      } catch {
        result[row.key] = row.value;
      }
    }
    return result as T;
  } catch (error) {
    console.error("getSettings error:", error);
    return defaults;
  }
}

export async function getPublicProjects(opts?: { featuredOnly?: boolean }): Promise<DbProject[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder));
    return opts?.featuredOnly ? rows.filter((p) => p.featured) : rows;
  } catch (error) {
    console.error("getPublicProjects error:", error);
    return [];
  }
}

export async function getPublicProjectBySlug(slug: string): Promise<DbProject | null> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getPublicProjectBySlug error:", error);
    return null;
  }
}

export async function getPublicPricing(): Promise<DbPricingTier[]> {
  try {
    return await db
      .select()
      .from(pricingTiers)
      .where(eq(pricingTiers.isActive, true))
      .orderBy(asc(pricingTiers.sortOrder));
  } catch (error) {
    console.error("getPublicPricing error:", error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<DbTestimonial[]> {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.isActive, true), eq(testimonials.featured, true)))
      .orderBy(asc(testimonials.sortOrder));
  } catch (error) {
    console.error("getFeaturedTestimonials error:", error);
    return [];
  }
}

export async function getPublicTestimonials(): Promise<DbTestimonial[]> {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(asc(testimonials.sortOrder));
  } catch (error) {
    console.error("getPublicTestimonials error:", error);
    return [];
  }
}

export type DbContentPage = typeof contentPages.$inferSelect;

export async function getContentPage(slug: string): Promise<DbContentPage | null> {
  try {
    const rows = await db
      .select()
      .from(contentPages)
      .where(eq(contentPages.slug, slug))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getContentPage error:", error);
    return null;
  }
}

export async function getPublicTeam(): Promise<DbTeamMember[]> {
  try {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.sortOrder));
  } catch (error) {
    console.error("getPublicTeam error:", error);
    return [];
  }
}

export type DbPost = typeof posts.$inferSelect;

export async function getPublicPosts(): Promise<DbPost[]> {
  try {
    return await db
      .select()
      .from(posts)
      .where(and(eq(posts.status, "published"), lte(posts.publishedAt, new Date())))
      .orderBy(desc(posts.publishedAt));
  } catch (error) {
    console.error("getPublicPosts error:", error);
    return [];
  }
}

export const getPostBySlug = cache(async function getPostBySlug(slug: string): Promise<DbPost | null> {
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published"), lte(posts.publishedAt, new Date())))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error("getPostBySlug error:", error);
    return null;
  }
});

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    if (rows[0] && rows[0].value !== null) {
      try {
        return JSON.parse(rows[0].value) as T;
      } catch {
        return rows[0].value as unknown as T;
      }
    }
    return defaultValue;
  } catch (error) {
    console.error(`getSetting error for key ${key}:`, error);
    return defaultValue;
  }
}

export type DbResource = typeof resources.$inferSelect;

export async function getPublicResources(): Promise<DbResource[]> {
  try {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isActive, true))
      .orderBy(asc(resources.sortOrder));
  } catch (error) {
    console.error("getPublicResources error:", error);
    return [];
  }
}
