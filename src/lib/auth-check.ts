import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("rrrtx_session");

  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
