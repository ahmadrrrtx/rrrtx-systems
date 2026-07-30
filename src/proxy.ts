import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { serviceData } from "@/lib/service-data";

async function validateDynamicService(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/services/")) return null;
  const slug = pathname.slice("/services/".length).split("/")[0];
  if (!slug || serviceData[slug]) return null;

  try {
    const checkUrl = new URL("/api/services", request.url);
    checkUrl.searchParams.set("public", "exists");
    checkUrl.searchParams.set("slug", slug);
    const result = await fetch(checkUrl, { headers: { Accept: "application/json" } });
    if (!result.ok) return null; // Preserve availability during a database outage.
    const data = (await result.json()) as { exists?: boolean };
    if (!data.exists) {
      return NextResponse.rewrite(new URL("/__rrrtx_not_found__", request.url), {
        status: 404,
        headers: { "X-Robots-Tag": "noindex, nofollow, noarchive" },
      });
    }
  } catch {
    return null;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const serviceResponse = await validateDynamicService(request);
  if (serviceResponse) return serviceResponse;

  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

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

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:slug"],
};
