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
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1400&h=700&fit=crop",
    title: "Toy Paradise",
    highlight: "Fun for Everyone",
    description: "Explore our curated collection of sensory, Montessori & STEM toys that inspire creativity and learning.",
    cta: { label: "Shop Toys", href: "/products?category=toy-paradise" },
    secondary: { label: "View All", href: "/categories" },
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&h=700&fit=crop",
    title: "Home Decor",
    highlight: "Transform Your Space",
    description: "Beautiful wall art, candles, cushions & more to make every corner of your home feel special.",
    cta: { label: "Shop Decor", href: "/products?category=home-decor" },
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=700&fit=crop",
    title: "Kitchen Essentials",
    highlight: "Cook with Style",
    description: "Premium cookware, bakeware and kitchen tools for the home chef in you.",
    cta: { label: "Shop Kitchen", href: "/products?category=kitchen-items" },
  },
  {
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&h=700&fit=crop",
    title: "Gardening",
    highlight: "Grow Your Green World",
    description: "Seeds, tools, planters and everything you need for a thriving garden.",
    cta: { label: "Shop Garden", href: "/products?category=gardening" },
  },
  {
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=1400&h=700&fit=crop",
    title: "Gift Items",
    highlight: "Perfect Presents",
    description: "Handpicked gift boxes, personalized items & curated hampers for every occasion.",
    cta: { label: "Shop Gifts", href: "/products?category=gift-items" },
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
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay (always on top) */}
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
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-400/20 text-primary-300 border border-primary-400/30 backdrop-blur-sm mb-4">
                  ✨ {slide.title}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
                  {slide.highlight}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 max-w-md leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.cta.href}>
                    <Button size="lg" className="text-sm sm:text-base">
                      {slide.cta.label}
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  {slide.secondary && (
                    <Link href={slide.secondary.href}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="text-sm sm:text-base border-white/30 text-white hover:bg-white/10"
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
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-all"
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
                ? "w-8 h-2.5 bg-primary-400"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
