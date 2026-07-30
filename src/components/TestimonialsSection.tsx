import { getPublicTestimonials } from "@/lib/queries";
import { SectionWrapper } from "./SectionWrapper";
import { TestimonialSlider } from "./TestimonialSlider";

export async function TestimonialsSection() {
  if (!process.env.TURSO_DATABASE_URL && process.env.NODE_ENV === "production") return null;
  // Safe fetch: returns [] on any error (missing table, DB down) so the build
  // and the public site never crash.
  const rows = await getPublicTestimonials();

  // If there are no active testimonials, render nothing (same as before).
  if (rows.length === 0) return null;

  return (
    <SectionWrapper id="testimonials" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Proof</p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">Trusted by Founders Who Ship.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Real results from real systems.</p>
        </div>
        
        <TestimonialSlider testimonials={rows} />
      </div>
    </SectionWrapper>
  );
}
