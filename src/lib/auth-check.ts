import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./session";
import { validateRequestOrigin } from "./request-security";

export async function getAuthenticatedSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAuth(request?: Request) {
  const session = await getAuthenticatedSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (request && !["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const originError = validateRequestOrigin(request);
    if (originError) return originError;
  }

  return null;
}
