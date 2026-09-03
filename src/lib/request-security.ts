import { NextResponse } from "next/server";
import { SITE_URL } from "./site-config";

type RateEntry = { count: number; resetAt: number };
const rateStore = new Map<string, RateEntry>();

export function clientAddress(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    ""
  );
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  options: { limit: number; windowMs: number }
): NextResponse | null {
  const now = Date.now();
  const key = `${scope}:${clientAddress(request)}`;
  const current = rateStore.get(key);

  if (!current || current.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (current.count >= options.limit) {
    return NextResponse.json(
      { error: "Too many requests. Please wait and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((current.resetAt - now) / 1000))),
        },
      }
    );
  }

  current.count += 1;
  if (rateStore.size > 2_000) {
    for (const [storedKey, entry] of rateStore) {
      if (entry.resetAt <= now) rateStore.delete(storedKey);
    }
  }
  return null;
}

let warnedAnyOrigin = false;

export function validateRequestOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  const allowed = new Set([SITE_URL, "https://www.rrrtx-systems.com"]);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  // Optional extra origins for staging / PR / sandbox previews (comma-separated).
  // A literal "*" permits any origin and must NEVER be set in production —
  // it exists solely for ephemeral preview environments.
  const extra = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((entry) => entry.trim().replace(/\/$/, ""))
    .filter(Boolean);
  if (extra.includes("*")) {
    if (!warnedAnyOrigin) {
      warnedAnyOrigin = true;
      console.warn("ALLOWED_ORIGINS=* is active — any Origin is permitted. Never enable in production.");
    }
    return null;
  }
  for (const entry of extra) allowed.add(entry);

  if (!allowed.has(origin.replace(/\/$/, ""))) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  return null;
}

export function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

export function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2_048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSafePublicUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2_048) return false;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  return isSafeHttpUrl(value);
}

export function pickAllowedFields(
  body: Record<string, unknown>,
  allowedFields: readonly string[]
): Record<string, unknown> {
  const allowed = new Set(allowedFields);
  return Object.fromEntries(
    Object.entries(body).filter(([key, value]) => allowed.has(key) && value !== undefined)
  );
}

export async function readJsonBody<T = Record<string, unknown>>(
  request: Request,
  maxBytes = 32_000
): Promise<T | null> {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > maxBytes) return null;
  try {
    const text = await request.text();
    if (!text || text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
