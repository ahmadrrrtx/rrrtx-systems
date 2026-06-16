"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { DbTestimonial } from "@/lib/queries";

export function TestimonialSlider({ testimonials }: { testimonials: DbTestimonial[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index, testimonials.length]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials.length) return null;

  const current = testimonials[index];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Slider content */}
      <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full flex flex-col items-center text-center p-6 sm:p-10 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/80 transition-colors"
          >
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < (current.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-medium leading-relaxed mb-8 max-w-3xl">
              &quot;{current.quote}&quot;
            </blockquote>

            {/* User Info */}
            <div className="flex items-center gap-4 text-left">
              {current.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.imageUrl}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold border border-slate-700">
                  {current.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}
              <div>
                <cite className="not-italic font-semibold text-white text-base block">{current.name}</cite>
                <span className="text-xs text-cyan-400 font-medium tracking-wide">
                  {current.role}
                  {current.role && current.company ? " · " : ""}
                  {current.company}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-white/5 transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === index ? "bg-cyan-400 w-6" : "bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-white/5 transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
