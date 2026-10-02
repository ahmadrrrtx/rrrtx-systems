"use client";

import { useEffect, useRef } from "react";

/**
 * Client island for the IntegrationNetwork section.
 *
 * The SVG markup itself is rendered on the server and passed in as
 * children (kept out of the client bundle). This island only:
 *   1. creates the pulse dots that travel along core connectors
 *      (skipped entirely when the user prefers reduced motion),
 *   2. highlights adjacency on hover/focus and mutes everything else,
 *   3. shows the platform name pill near the active node.
 *
 * Everything is scoped to this section; no global listeners beyond
 * the ones attached here, all removed on unmount.
 */
export function NetworkInteractivity({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const stage = host.closest(".net-stage") as HTMLElement | null;
    const svg = host.querySelector("svg");
    if (!stage || !svg) return;

    const nodes = Array.from(svg.querySelectorAll<SVGGElement>(".net-node"));
    const links = Array.from(svg.querySelectorAll<SVGPathElement>(".net-link"));
    const pill = stage.querySelector<HTMLElement>("[data-net-pill]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pulses: Array<SVGCircleElement> = [];
    if (!reduced) {
      links
        .filter((l) => l.dataset.kind === "core")
        .forEach((link, i) => {
          for (let k = 0; k < 2; k++) {
            const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const r = k === 0 ? 3.2 : 2.4;
            c.setAttribute("r", String(r));
            c.setAttribute("class", "net-pulse");
            c.style.offsetPath = `path('${link.getAttribute("d")}')`;
            c.style.setProperty("--pulse-duration", `${(4.5 + (i % 4) * 0.7 + k * 0.4).toFixed(1)}s`);
            c.style.setProperty("--pulse-delay", `${(-(i * 0.9 + k * 2.3)).toFixed(1)}s`);
            c.dataset.a = link.dataset.a ?? "";
            c.dataset.b = link.dataset.b ?? "";
            svg.appendChild(c);
            pulses.push(c);
          }
        });
    }

    const adjacentOf = (node: SVGGElement) => {
      const set = new Set<string>((node.dataset.adj ?? "").split(" ").filter(Boolean));
      set.add(node.dataset.node ?? "");
      return set;
    };

    const clear = () => {
      nodes.forEach((n) => n.classList.remove("is-active", "is-dim"));
      links.forEach((l) => l.classList.remove("is-lit", "is-dim"));
      pulses.forEach((p) => {
        p.classList.remove("is-paused");
        p.style.opacity = "";
      });
      if (pill) pill.style.opacity = "0";
    };

    const activate = (node: SVGGElement, showPill: boolean) => {
      const keep = adjacentOf(node);
      nodes.forEach((n) => {
        const on = keep.has(n.dataset.node ?? "");
        n.classList.toggle("is-active", n === node);
        n.classList.toggle("is-dim", !on);
      });
      links.forEach((l) => {
        const lit = keep.has(l.dataset.a ?? "") && keep.has(l.dataset.b ?? "");
        l.classList.toggle("is-lit", lit);
        l.classList.toggle("is-dim", !lit);
      });
      pulses.forEach((p) => {
        const lit = keep.has(p.dataset.a ?? "") && keep.has(p.dataset.b ?? "");
        p.classList.toggle("is-paused", !lit);
        p.style.opacity = lit ? "" : "0";
      });
      if (pill && showPill) {
        const stageRect = stage.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        pill.dataset.glow = node.dataset.glow ?? "";
        pill.style.left = `${rect.left - stageRect.left + rect.width / 2}px`;
        pill.style.top = `${rect.top - stageRect.top}px`;
        pill.innerHTML = "";
        const b = document.createElement("b");
        b.textContent = node.dataset.name ?? "";
        const small = document.createElement("small");
        small.textContent = node.dataset.role ?? "";
        pill.append(b, small);
        pill.style.opacity = "1";
      }
    };

    const onEnter = (n: SVGGElement) => () => activate(n, true);
    const onLeave = () => clear();

    // Hovering the core hub lights every platform — "everything connects".
    const hub = nodes.find((n) => n.dataset.node === "center");
    const hubEnter = () => svg.classList.add("hub-hot");
    const hubLeave = () => svg.classList.remove("hub-hot");

    const cleanups: Array<() => void> = [];
    nodes.forEach((n) => {
      const enter = onEnter(n);
      const focus = () => activate(n, true);
      n.addEventListener("mouseenter", enter);
      n.addEventListener("mouseleave", onLeave);
      n.addEventListener("focus", focus);
      n.addEventListener("blur", onLeave);
      cleanups.push(() => {
        n.removeEventListener("mouseenter", enter);
        n.removeEventListener("mouseleave", onLeave);
        n.removeEventListener("focus", focus);
        n.removeEventListener("blur", onLeave);
      });
    });

    if (hub) {
      hub.addEventListener("mouseenter", hubEnter);
      hub.addEventListener("mouseleave", hubLeave);
      cleanups.push(() => {
        hub.removeEventListener("mouseenter", hubEnter);
        hub.removeEventListener("mouseleave", hubLeave);
      });
    }

    return () => {
      cleanups.forEach((fn) => fn());
      pulses.forEach((p) => p.remove());
      svg.classList.remove("hub-hot");
      clear();
    };
  }, []);

  return (
    <div ref={hostRef} className="net-svg-wrap">
      {children}
    </div>
  );
}
