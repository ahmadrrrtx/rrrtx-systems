import { SectionWrapper } from "./SectionWrapper";
import { ProcessStages } from "./ProcessStages";

/**
 * Our Process — "From Problem to Production".
 * Header is a server component; the connected stage circles are a small
 * client island (ProcessStages). Copy unchanged from the previous strip.
 */
export function ProcessStrip() {
  return (
    <SectionWrapper id="process" className="relative overflow-hidden py-24 lg:py-32">
      <div className="soft-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 h-[320px] w-[760px] -translate-x-1/2 rounded-full bg-cyan-500/[0.035] blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-4 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">Our Process</p>
          <h2 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-white lg:text-4xl xl:text-5xl">From Problem to Production</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">Four deliberate stages. Clear decisions, measurable gates, and no mystery handoffs.</p>
        </header>
        <ProcessStages />
      </div>
    </SectionWrapper>
  );
}
