// Public existence check used by the proxy to serve a real 404 for unknown
// certificate IDs (mirrors the existing /api/services existence check).

import { NextResponse } from "next/server";
import { getPublicDocument } from "@/lib/partner-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const check = searchParams.get("check");
  const id = searchParams.get("id") || "";
  if (check === "exists" && /^[A-Za-z0-9-]{4,64}$/.test(id)) {
    const doc = await getPublicDocument(id);
    return NextResponse.json({ exists: Boolean(doc) });
  }
  return NextResponse.json({ exists: false });
}
