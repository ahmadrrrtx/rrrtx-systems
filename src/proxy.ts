import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { PARTNER_SESSION_COOKIE } from "@/lib/partner-session";
import {
  documentIdExists,
  postSlugExists,
  projectSlugExists,
  serviceSlugExists,
} from "@/lib/route-existence";

/**
 * Proxied dynamic routes.
 *
 * These pages render their own `notFound()` when a record is missing, but
 * Next.js cannot change the status code once a streamed response has begun, so
 * the result would be a `200` carrying the 404 UI — a soft 404 for crawlers.
 * Confirming existence here, before streaming starts, produces a real 404. It
 * is the pattern the App Router docs recommend.
 *
 * The checks run in-process (the proxy uses the Node.js runtime by default in
 * Next.js 16) rather than through an outbound fetch to this same deployment.
 *
 * A `null` result means "could not determine" — for example during a database
 * outage — and is treated as "let the request through" so availability is
 * preserved.
 */

const REWRITE_TARGET = "/__rrrtx_not_found__";

function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL(REWRITE_TARGET, request.url), {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
  });
}

/** Extract the first path segment after `prefix`, ignoring anything after it. */
function segmentAfter(pathname: string, prefix: string): string {
  return pathname.slice(prefix.length).split("/")[0] || "";
}

async function checkContentExists(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/services/")) {
    const slug = segmentAfter(pathname, "/services/");
    if (!slug) return null;
    // Never shadow a real sub-route such as /services/some/deeper/path.
    if (pathname !== `/services/${slug}`) return null;
    if ((await serviceSlugExists(slug)) === false) return notFound(request);
    return null;
  }

  if (pathname.startsWith("/work/")) {
    const slug = segmentAfter(pathname, "/work/");
    if (!slug || pathname !== `/work/${slug}`) return null;
    if ((await projectSlugExists(slug)) === false) return notFound(request);
    return null;
  }

  if (pathname.startsWith("/blog/")) {
    const slug = segmentAfter(pathname, "/blog/");
    if (!slug || pathname !== `/blog/${slug}`) return null;
    if ((await postSlugExists(slug)) === false) return notFound(request);
    return null;
  }

  if (pathname.startsWith("/verify/")) {
    const id = segmentAfter(pathname, "/verify/");
    // Reject malformed identifiers before they reach the database.
    if (!/^[A-Za-z0-9-]{4,64}$/.test(id)) return null;
    if (pathname !== `/verify/${id}`) return null;
    if ((await documentIdExists(id)) === false) return notFound(request);
    return null;
  }

  return null;
}

function privateResponse(): NextResponse {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Admin dashboard ─────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const isLogin = pathname === "/dashboard/login";
    const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (!isLogin && (!session || session.role !== "admin")) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isLogin && session?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return privateResponse();
  }

  // ── Partner portal ──────────────────────────────────────
  if (pathname.startsWith("/partner")) {
    const publicPaths = ["/partner/login", "/partner/activate"];
    const session = await verifySessionToken(request.cookies.get(PARTNER_SESSION_COOKIE)?.value);
    const isPartner = session?.role === "partner" && typeof session.partnerId === "number";

    if (publicPaths.includes(pathname)) {
      if (isPartner) return NextResponse.redirect(new URL("/partner/dashboard", request.url));
      return privateResponse();
    }
    if (!isPartner) {
      const loginUrl = new URL("/partner/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return privateResponse();
  }

  // ── Public content: real 404s for slugs that do not exist ──
  return (await checkContentExists(request)) ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/partner/:path*",
    "/services/:slug",
    "/work/:slug",
    "/blog/:slug",
    "/verify/:id",
  ],
};
