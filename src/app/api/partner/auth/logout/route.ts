import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PARTNER_SESSION_COOKIE } from "@/lib/partner-session";
import { validateRequestOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  // Same origin guard as /api/auth/logout: a cross-site page must not be able to
  // drive state-changing requests, even one as small as a forced logout.
  const originError = validateRequestOrigin(request);
  if (originError) return originError;

  const cookieStore = await cookies();
  cookieStore.set(PARTNER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
