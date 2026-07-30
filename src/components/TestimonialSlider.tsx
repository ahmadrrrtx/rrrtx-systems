"use client";

import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { DbTestimonial } from "@/lib/queries";
import { SmartImage } from "./SmartImage";

export function TestimonialSlider({ testimonials }: { testimonials: DbTestimonial[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (testimonials.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((previous) => previous === testimonials.length - 1 ? 0 : previous + 1), 6000);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);
  if (!testimonials.length) return null;
  const current = testimonials[index];

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="min-h-[300px] flex items-center justify-center">
        <figure className="w-full flex flex-col items-center text-center p-6 sm:p-10 rounded-2xl bg-slate-950/40 border border-slate-800/50">
          <div className="flex items-center gap-1 mb-6" aria-label={`${current.rating || 5} out of 5 stars`}>{Array.from({ length: 5 }).map((_, star) => <Star key={star} className={`w-5 h-5 ${star < (current.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`} aria-hidden="true" />)}</div>
          <blockquote className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-medium leading-relaxed mb-8 max-w-3xl">&quot;{current.quote}&quot;</blockquote>
          <figcaption className="flex items-center gap-4 text-left">
            {current.imageUrl ? <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-700"><SmartImage src={current.imageUrl} alt={current.name} sizes="48px" className="object-cover" /></div> : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">{current.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}</div>}
            <div><cite className="not-italic font-semibold text-white text-base block">{current.name}</cite><span className="text-xs text-cyan-400 font-medium">{current.role}{current.role && current.company ? " · " : ""}{current.company}</span></div>
          </figcaption>
        </figure>
      </div>
      {testimonials.length > 1 && <div className="flex items-center justify-center gap-6 mt-8"><button type="button" onClick={() => setIndex((previous) => previous === 0 ? testimonials.length - 1 : previous - 1)} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-300 hover:text-white" aria-label="Previous testimonial"><ChevronLeft className="w-5 h-5" aria-hidden="true" /></button><div className="flex gap-2">{testimonials.map((testimonial, dot) => <button type="button" key={testimonial.id} onClick={() => setIndex(dot)} className={`h-2.5 rounded-full transition-all ${dot === index ? "bg-cyan-400 w-6" : "bg-slate-700 w-2.5"}`} aria-label={`Show testimonial ${dot + 1}`} aria-current={dot === index ? "true" : undefined} />)}</div><button type="button" onClick={() => setIndex((previous) => previous === testimonials.length - 1 ? 0 : previous + 1)} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-300 hover:text-white" aria-label="Next testimonial"><ChevronRight className="w-5 h-5" aria-hidden="true" /></button></div>}
    </div>
  );
}
