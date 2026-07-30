const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const SESSION_COOKIE = "rrrtx_session";
export const SESSION_MAX_AGE = 60 * 60 * 12;

type SessionPayload = {
  version: 1;
  email: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

function getSessionSecret(): string | null {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD;

  if (!secret || (process.env.NODE_ENV === "production" && secret.length < 12)) {
    return null;
  }

  return secret;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function getKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages
  );
}

export async function createSessionToken(input: {
  email: string;
  role?: string | null;
}): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    version: 1,
    email: input.email,
    role: input.role || "admin",
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE,
    nonce: crypto.randomUUID(),
  };
  const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));

  return `${encodedPayload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const [encodedPayload, encodedSignature, ...extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra.length) return null;

  try {
    const key = await getKey(secret, ["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlToBytes(encodedSignature),
      encoder.encode(encodedPayload)
    );
    if (!valid) return null;

    const payload = JSON.parse(
      decoder.decode(base64UrlToBytes(encodedPayload))
    ) as Partial<SessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    if (
      payload.version !== 1 ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number" ||
      typeof payload.nonce !== "string" ||
      payload.expiresAt <= now ||
      payload.issuedAt > now + 60
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}
