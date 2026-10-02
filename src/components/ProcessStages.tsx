"use client";

import { useState } from "react";
import { Search, Code2, Rocket, BarChart3 } from "lucide-react";

/**
 * "From Problem to Production" — four connected stage circles on a flowing
 * spine. Clicking a circle (or its card) opens a detail popover.
 *
 * Copy is intentionally identical to the previous ProcessStrip content.
 * This is a client island only because of the expand interaction; the
 * section header above it stays a server component.
 */

const STEPS = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Audit & map",
    description:
      "Audit the current stack, conversion path, automation gaps, and delivery constraints before changing code.",
    icon: Search,
    color: "#67e8f9",
    glow: "rgba(34,211,238,.55)",
  },
  {
    number: "02",
    title: "Build",
    subtitle: "Architecture & code",
    description:
      "Engineer the smallest responsible solution around your business logic, data, and existing integrations.",
    icon: Code2,
    color: "#93c5fd",
    glow: "rgba(96,165,250,.55)",
  },
  {
    number: "03",
    title: "Deploy",
    subtitle: "Ship & validate",
    description:
      "Release through controlled environments with testing, monitoring, documentation, and a clear rollback path.",
    icon: Rocket,
    color: "#c4b5fd",
    glow: "rgba(167,139,250,.55)",
  },
  {
    number: "04",
    title: "Optimize",
    subtitle: "Measure & tune",
    description:
      "Measure conversion, reliability, performance, and lead quality, then improve what the evidence supports.",
    icon: BarChart3,
    color: "#f0abfc",
    glow: "rgba(244,114,182,.5)",
  },
] as const;

export function ProcessStages() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="relative mt-16">
      {/* Spine with flowing dots (desktop); vertical on mobile via CSS */}
      <div className="proc-spine hidden md:block" aria-hidden="true">
        {[0, -2.4, -4.8].map((delay) => (
          <span
            key={delay}
            className="proc-spine-dot"
            style={{ "--spine-delay": `${delay}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <div className="proc-spine md:hidden" aria-hidden="true" />

      <ol className="relative grid gap-5 md:grid-cols-4 md:gap-5">
        {STEPS.map((step, index) => {
          const isOpen = open === index;
          const above = index % 2 === 0; // zig-zag: odd steps sit below the spine
          return (
            <li
              key={step.number}
              data-open={isOpen}
              className="md:grid md:grid-rows-[1fr_110px_1fr] md:min-h-[400px]"
              style={{ "--pc": step.color, "--pcg": step.glow } as React.CSSProperties}
            >
              <button
                type="button"
                className="pcircle mx-auto md:row-start-2"
                aria-expanded={isOpen}
                aria-controls={`process-detail-${index}`}
                aria-label={`Stage ${step.number}: ${step.title} — ${step.subtitle}. ${isOpen ? "Hide details" : "Show details"}`}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="pc-oring" aria-hidden="true" />
                <step.icon className="premium-icon" aria-hidden="true" />
                <span className="pc-num">{step.number}</span>
              </button>

              <div
                className={`relative mt-4 md:mt-0 ${
                  above ? "md:row-start-1" : "md:row-start-3"
                } md:self-center`}
              >
                <button
                  type="button"
                  className="phead-card"
                  aria-expanded={isOpen}
                  aria-controls={`process-detail-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.16em]" style={{ color: step.color }}>
                    {step.subtitle}
                  </span>
                  <span className="text-lg font-bold text-white">{step.title}</span>
                  <span className="mt-1 inline-flex font-mono text-[9.5px] uppercase tracking-[0.12em] text-cyan-300">
                    {isOpen ? "− details" : "+ details"}
                  </span>
                </button>

                <div
                  id={`process-detail-${index}`}
                  className="pcard-pop"
                  aria-hidden={!isOpen}
                >
                  <div className="pcard-pop-in">
                    <b className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-[0.14em]" style={{ color: step.color }}>
                      Stage {step.number} · {step.subtitle}
                    </b>
                    {step.description}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
