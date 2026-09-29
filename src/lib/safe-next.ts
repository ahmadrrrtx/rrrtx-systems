/**
 * Validates the `?next=` return path used after sign-in.
 *
 * The proxy redirects unauthenticated visitors to `/partner/login?next=<path>`.
 * That value is attacker-controllable (it is just a query parameter), so it must
 * never be handed to `router.push()` unvalidated: `https://evil.example`,
 * `//evil.example`, `/\evil.example` and control-character variants would all turn
 * the login page into an open redirect.
 *
 * Rules: the value must be a rooted path (`/…`) on this origin, contain no
 * backslash, no scheme separator and no control characters, and must live under
 * one of the allowed prefixes. Anything else falls back to the default.
 */
export function safeNextPath(
  value: string | null | undefined,
  fallback: string,
  allowedPrefixes: string[]
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (value.includes("\\") || value.includes("://")) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;

  const path = value.split(/[?#]/)[0];
  const allowed = allowedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`)
  );
  return allowed ? value : fallback;
}
