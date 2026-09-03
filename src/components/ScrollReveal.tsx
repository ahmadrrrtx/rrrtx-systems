"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal controller.
 *
 * The hidden state is applied purely via CSS (html.rrrtx-js [data-reveal]),
 * and the `rrrtx-js` class is added by a pre-hydration script in the root
 * layout — so there is no flash of hidden content. This component only
 * observes `[data-reveal]` elements and reveals them as they enter the
 * viewport. Re-runs on every client-side navigation.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("rrrtx-js");

    const revealAll = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("rrrtx-revealed"));
    };

    if (typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rrrtx-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.rrrtx-revealed)").forEach((el) => io.observe(el));
    };
    scan();

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
