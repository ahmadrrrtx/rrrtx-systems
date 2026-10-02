"use client";

import { useState } from "react";
import { BrandIcon } from "./BrandIcon";

/**
 * Logo-first stack card: shows only the official mark; hover or tap flips
 * the card (3D rotateY) to reveal the technology name and role on the back.
 * Reduced motion disables the hover flip (CSS) while the explicit toggle
 * still works for keyboard/touch users.
 */
export function StackFlipCard({
  name,
  category,
  paths,
  floatDuration,
  floatDelay,
}: {
  name: string;
  category: string;
  paths?: readonly string[];
  floatDuration: string;
  floatDelay: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className="stack-flip"
      data-flipped={flipped}
      aria-pressed={flipped}
      aria-label={`${name} — ${category}. ${flipped ? "Hide name" : "Reveal name"}.`}
      style={{
        "--float-duration": floatDuration,
        "--float-delay": floatDelay,
      } as React.CSSProperties}
      onClick={() => setFlipped((v) => !v)}
    >
      <span className="stack-flip-in block">
        <span className="stack-face">
          {paths?.length ? (
            <BrandIcon
              paths={paths}
              label={undefined}
              className="stack-glyph h-[30px] w-[30px]"
            />
          ) : (
            <span aria-hidden="true" className="text-lg font-bold text-slate-200">
              {name.slice(0, 2)}
            </span>
          )}
        </span>
        <span className="stack-face stack-face--back">
          <small>{category}</small>
          <b>{name}</b>
        </span>
      </span>
    </button>
  );
}
