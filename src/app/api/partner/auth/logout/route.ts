import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PARTNER_SESSION_COOKIE } from "@/lib/partner-session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(PARTNER_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
