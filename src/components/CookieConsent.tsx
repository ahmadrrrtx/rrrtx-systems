"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, X } from "lucide-react";
import { CONSENT_EVENT, getConsent, isPrivateSurface, setConsent } from "@/lib/consent";

/**
 * The banner exists to control analytics on public pages. The admin dashboard
 * and partner portal are authenticated, private and explicitly noindex, and no
 * non-essential tracking is loaded there, so showing a consent prompt would be
 * noise for signed-in staff. Visitors who want to change their choice can use
 * the footer control on any public page.
 */
/** No-op subscription — used only to distinguish server render from client. */
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Subscribe to consent changes so the panel reflects the stored choice live. */
function subscribeConsent(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/** null = no choice recorded yet; true/false = the recorded analytics choice. */
function getConsentSnapshot(): boolean | null {
  const consent = getConsent();
  return consent ? consent.analytics : null;
}

const EVENT_OPEN_SETTINGS = "rrrtx:open-cookie-settings";

/**
 * Cookie banner.
 *
 * Accept and Reject carry equal visual weight, and the preferences panel lets
 * analytics be toggled independently. The footer's "Cookie settings" control
 * reopens the panel, so withdrawing consent is exactly as easy as giving it.
 *
 * This component only records a preference. It loads nothing. GoogleAnalytics
 * reads the same stored choice before it will inject any script, so declining
 * means the Google script is never requested.
 */
export function CookieConsent() {
  const pathname = usePathname();
  const isClient = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
  const consentChoice = useSyncExternalStore(subscribeConsent, getConsentSnapshot, () => null);

  // Reopened from the footer after a decision had already been made.
  const [reopened, setReopened] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only set once the visitor touches the analytics toggle, so the control
  // always reflects the stored choice until they change it.
  const [analyticsOverride, setAnalyticsOverride] = useState<boolean | null>(null);
  const analyticsOn = analyticsOverride ?? consentChoice ?? false;

  const showDetails = reopened;

  useEffect(() => {
    const reopen = () => {
      setReopened(true);
      setDismissed(false);
    };
    window.addEventListener(EVENT_OPEN_SETTINGS, reopen);
    return () => window.removeEventListener(EVENT_OPEN_SETTINGS, reopen);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    setConsent({ analytics, decidedAt: Date.now() });
    setAnalyticsOverride(null);
    setReopened(false);
    setDismissed(true);
  }, []);

  // Before mount the server and first client render agree (nothing shown), so
  // there is no hydration mismatch.
  if (!isClient || isPrivateSurface(pathname)) return null;

  const open = !dismissed && (consentChoice === null || reopened);
  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Cookie settings"
      className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="cookie-card relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/90 backdrop-blur-xl shadow-[0_24px_70px_-20px_rgba(0,0,0,.9)] p-5 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" aria-hidden="true" />
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/[0.07]">
            <Cookie className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white mb-2">
              {showDetails ? "Cookie settings" : "Cookies on this site"}
            </h2>

            {!showDetails ? (
              // Kept to a single short line on purpose. This block is mounted
              // during hydration, so a large one becomes the Largest
              // Contentful Paint element and delays LCP. The full detail lives
              // in the Cookie Policy, one click away.
              <p className="text-xs text-slate-400">
                Essential cookies keep the site working. May we also use analytics to see which
                pages are useful?{" "}
                <Link href="/cookies" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                  Cookie Policy
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 transition-colors duration-200 hover:border-slate-700/80">
                  <p className="text-xs font-medium text-slate-200">Strictly necessary</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Required for sign-in and to remember this choice. Always active.
                  </p>
                </div>
                <label className="flex items-start gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-3 cursor-pointer transition-colors duration-200 hover:border-cyan-500/30">
                  <input
                    type="checkbox"
                    checked={analyticsOn}
                    onChange={(e) => setAnalyticsOverride(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-0"
                  />
                  <span>
                    <span className="block text-xs font-medium text-slate-200">Analytics</span>
                    <span className="block text-xs text-slate-500 mt-1 leading-relaxed">
                      Google Analytics 4. Sets cookies and sends usage data to Google. Off unless you
                      switch it on.
                    </span>
                  </span>
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {showDetails ? (
                <>
                  <button
                    type="button"
                    onClick={() => decide(analyticsOn)}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_22px_-6px_rgba(139,92,246,.6)] active:scale-[.98]"
                  >
                    Save preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800/60 hover:text-white active:scale-[.98]"
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800/60 hover:text-white active:scale-[.98]"
                  >
                    Reject non-essential
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => decide(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_22px_-6px_rgba(139,92,246,.6)] active:scale-[.98]"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(false)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800/60 hover:text-white active:scale-[.98]"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setReopened(true)}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    Manage preferences
                  </button>
                </>
              )}
            </div>
          </div>

          {showDetails && (
            <button
              type="button"
              onClick={() => {
                setReopened(false);
                setDismissed(true);
              }}
              aria-label="Close cookie settings"
              className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Footer control. Reopens the panel and lets consent be withdrawn later. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENT_OPEN_SETTINGS))}
      className={className || "hover:text-white transition-colors"}
    >
      Cookie settings
    </button>
  );
}
