import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("rrrtx_session");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard") && !request.nextUrl.pathname.startsWith("/dashboard/login");

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
