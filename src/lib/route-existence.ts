/**
 * Fast existence checks for the proxy.
 *
 * Why this file exists
 * --------------------
 * Next.js streams responses, and once streaming starts the HTTP status code is
 * already committed. A `notFound()` thrown inside a page therefore renders the
 * 404 UI with a `200 OK`, which crawlers can treat as a soft 404 (see the
 * "Status Codes" section of the App Router `loading.js` reference). The
 * documented remedy is to confirm the resource exists *before* the response is
 * streamed — in the proxy — and rewrite missing slugs to a not-found route.
 *
 * The previous implementation did that by issuing an outbound `fetch()` back to
 * the deployment for every request, which cost a second HTTP hop, a second
 * serverless invocation and a duplicate database query. The proxy has run on
 * the Node.js runtime by default since Next.js 16, so the existence check can
 * run in-process against the same database client the rest of the app uses.
 *
 * Contract: these return `true` (exists), `false` (definitively absent) or
 * `null` (could not be determined). Callers must treat `null` as "allow the
 * request through" so that a database outage degrades to the previous
 * streaming behaviour instead of taking the route offline.
 */

import { and, eq, lte } from "drizzle-orm";
import { db } from "./db";
import { posts, projects, partnerDocuments, services } from "./schema";
import { serviceData } from "./service-data";

export async function serviceSlugExists(slug: string): Promise<boolean | null> {
  // Statically authored services never need a database round trip.
  if (serviceData[slug]) return true;
  try {
    const rows = await db
      .select({ id: services.id })
      .from(services)
      .where(and(eq(services.slug, slug), eq(services.isActive, true)))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error("proxy serviceSlugExists failed:", error);
    return null;
  }
}

export async function documentIdExists(documentId: string): Promise<boolean | null> {
  try {
    const rows = await db
      .select({ id: partnerDocuments.id })
      .from(partnerDocuments)
      .where(eq(partnerDocuments.documentId, documentId))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error("proxy documentIdExists failed:", error);
    return null;
  }
}

export async function projectSlugExists(slug: string): Promise<boolean | null> {
  try {
    const rows = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error("proxy projectSlugExists failed:", error);
    return null;
  }
}

export async function postSlugExists(slug: string): Promise<boolean | null> {
  try {
    const rows = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        and(eq(posts.slug, slug), eq(posts.status, "published"), lte(posts.publishedAt, new Date()))
      )
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.error("proxy postSlugExists failed:", error);
    return null;
  }
}
