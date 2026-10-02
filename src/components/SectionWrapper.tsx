import { ReactNode } from "react";

export function SectionWrapper({
  children,
  className = "",
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}
