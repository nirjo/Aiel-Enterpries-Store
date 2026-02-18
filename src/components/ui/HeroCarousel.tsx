"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

interface Slide {
  image: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1400&h=700&fit=crop",
    title: "🧲 Levitation Toys",
    highlight: "Defy Gravity",
    description: "Magnetic levitation globes, floating speakers & hover gadgets that mesmerize kids and adults alike.",
    cta: { label: "Shop Levitation", href: "/products?category=levitation-toys" },
    secondary: { label: "Browse All", href: "/categories" },
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=700&fit=crop",
    title: "🌀 Gyroscopes & Spinners",
    highlight: "Mesmerizing Motion",
    description: "Precision gyroscopes, Euler's disks & kinetic desk toys that spin forever. Pure physics magic.",
    cta: { label: "Shop Gyroscopes", href: "/products?category=gyroscopes" },
  },
  {
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&h=700&fit=crop",
    title: "🔬 STEM Kits",
    highlight: "Learn by Playing",
    description: "Feel Flux, magnet science, robotics & coding kits — hands-on STEM for curious young minds.",
    cta: { label: "Shop STEM", href: "/products?category=stem-kits" },
  },
  {
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1400&h=700&fit=crop",
    title: "🧲 Magnetic Gadgets",
    highlight: "Feel the Force",
    description: "Ferrofluid art, magnetic putty, neodymium sets & mag-lev train kits that make physics tactile.",
    cta: { label: "Shop Magnets", href: "/products?category=magnetic-gadgets" },
  },
  {
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1400&h=700&fit=crop",
    title: "🚀 Space & Gravity",
    highlight: "Explore the Cosmos",
    description: "Planetarium projectors, plasma balls, rocket launchers & Newton's cradles — the universe at your fingertips.",
    cta: { label: "Shop Space", href: "/products?category=space-gravity" },
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-hidden bg-secondary-900">
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={current === 0}
          />
          {/* Deep space overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/85 via-[#050510]/50 to-[#050510]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-accent-400/15 text-accent-400 border border-accent-400/30 backdrop-blur-sm mb-4 tracking-wide">
                  {slide.title}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-[0_0_30px_rgba(0,123,255,0.3)]">
                  {slide.highlight}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/75 mb-6 max-w-md leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.cta.href}>
                    <Button size="lg" className="text-sm sm:text-base bg-gradient-to-r from-primary-400 to-accent-400 hover:from-primary-500 hover:to-accent-500 border-0 shadow-[0_0_24px_rgba(0,255,136,0.3)]">
                      {slide.cta.label}
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  {slide.secondary && (
                    <Link href={slide.secondary.href}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-sm sm:text-base border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                      >
                        {slide.secondary.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-accent-400/20 hover:border-accent-400/40 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-accent-400/20 hover:border-accent-400/40 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-gradient-to-r from-primary-400 to-accent-400"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
