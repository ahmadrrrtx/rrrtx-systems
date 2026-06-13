import { getFeaturedTestimonials } from "@/lib/queries";
import { SectionWrapper } from "./SectionWrapper";
import { Star } from "lucide-react";

export async function TestimonialsSection() {
  // Safe fetch: returns [] on any error (missing table, DB down) so the build
  // and the public site never crash.
  const rows = await getFeaturedTestimonials();

  // If there are no featured testimonials, render nothing (same as before).
  if (rows.length === 0) return null;

  return (
    <SectionWrapper id="testimonials" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-4">Proof</p>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">Trusted by Founders Who Ship.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Real results from real systems.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rows.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-2xl p-8 bg-slate-950/40 border border-slate-800/50 hover:border-slate-600/80 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < (t.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">
                    {t.role}{t.role && t.company ? " · " : ""}{t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
