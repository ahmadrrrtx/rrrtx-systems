/**
 * Cookie consent state, shared between the banner, the analytics loader and
 * the footer control.
 *
 * The choice is stored in a first-party cookie (not localStorage) so it is
 * cleared alongside other site data by standard browser controls and can be
 * read server-side later if consent ever needs to gate rendered markup.
 */

export const CONSENT_COOKIE = "rrrtx_cookie_consent";

/** Fired on window whenever the stored choice changes, so analytics can react
 *  without a page reload. */
export const CONSENT_EVENT = "rrrtx:consent-change";

export type ConsentState = {
  /** Non-essential analytics (Google Analytics 4). */
  analytics: boolean;
  /** Epoch milliseconds the choice was recorded; supports an audit trail. */
  decidedAt: number;
  /** Bumped whenever the categories change, so old choices are re-asked. */
  version: number;
};

export const CONSENT_VERSION = 1;

function decode(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  const decoded = decode(raw);
  if (!decoded) return null;
  try {
    const parsed = JSON.parse(decoded) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      analytics: parsed.analytics,
      decidedAt: typeof parsed.decidedAt === "number" ? parsed.decidedAt : Date.now(),
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function serializeConsent(state: { analytics: boolean; decidedAt: number }): string {
  const full: ConsentState = {
    analytics: state.analytics,
    decidedAt: state.decidedAt,
    version: CONSENT_VERSION,
  };
  return encodeURIComponent(JSON.stringify(full));
}

export function readConsentCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const name = CONSENT_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : undefined;
}

export function getConsent(): ConsentState | null {
  return parseConsent(readConsentCookie());
}

/** Persist a choice and notify listeners. 180 days, matching common practice. */
export function setConsent(next: { analytics: boolean; decidedAt: number }): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  if (navigator.cookieEnabled === false) return;

  const maxAge = 60 * 60 * 24 * 180;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(next)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;

  window.dispatchEvent(
    new CustomEvent<ConsentState | null>(CONSENT_EVENT, { detail: getConsent() })
  );
}

/**
 * Surfaces that are authenticated and private: the admin dashboard and the
 * partner portal. No consent prompt, no non-essential analytics and no page
 * views are recorded there, because those URLs can contain record identifiers
 * (for example /dashboard/leads/123) that must not reach a third-party
 * analytics property.
 */
export function isPrivateSurface(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname === "/partner" ||
    pathname.startsWith("/partner/")
  );
}
