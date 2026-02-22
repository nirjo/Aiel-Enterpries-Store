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
    title: "🧸 Aiel Toy Paradise",
    highlight: "Play, Learn & Grow",
    description: "Sensory toys, Montessori sets, STEM kits, action figures & more — the ultimate toy destination for curious kids.",
    cta: { label: "Shop Toys", href: "/products?category=aiel-toy-paradise" },
    secondary: { label: "Browse All", href: "/products" },
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=700&fit=crop",
    title: "🏠 Home & Kitchen",
    highlight: "Upgrade Your Kitchen",
    description: "Smart kitchen gadgets, cookware, storage solutions & everyday home essentials that make life easier.",
    cta: { label: "Shop Now", href: "/products?category=home-kitchen" },
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=700&fit=crop",
    title: "🪞 Home Decor",
    highlight: "Style Your Space",
    description: "Wall art, candles, cushions & stylish decor pieces to transform every room in your home.",
    cta: { label: "Shop Now", href: "/products?category=home-decor" },
  },
  {
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&h=700&fit=crop",
    title: "🌿 Gardening",
    highlight: "Grow Your Garden",
    description: "Premium tools, planters, seeds & garden decor — everything you need for a beautiful green space.",
    cta: { label: "Shop Now", href: "/products?category=gardening" },
  },
  {
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1400&h=700&fit=crop",
    title: "🎁 Gift Items",
    highlight: "Perfect Gifts Await",
    description: "Curated gift hampers, personalised presents & unique finds for birthdays, weddings & every occasion.",
    cta: { label: "Shop Now", href: "/products?category=gift-items" },
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=700&fit=crop",
    title: "⚡ Electronics",
    highlight: "Tech You'll Love",
    description: "Bluetooth speakers, smart gadgets, phone accessories & cutting-edge electronics at great prices.",
    cta: { label: "Shop Now", href: "/products?category=electronics" },
  },
  {
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1400&h=700&fit=crop",
    title: "✏️ Stationery Items",
    highlight: "Write, Create & Organise",
    description: "Notebooks, pens, art supplies, desk organisers & premium stationery for school, office & creativity.",
    cta: { label: "Shop Now", href: "/products?category=stationery-items" },
  },
  {
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&h=700&fit=crop",
    title: "🏋️ Sport & Exercise",
    highlight: "Stay Active & Fit",
    description: "Fitness gear, yoga mats, outdoor sports equipment & exercise accessories for an active lifestyle.",
    cta: { label: "Shop Now", href: "/products?category=sport-exercise" },
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
    <section className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-hidden bg-[#0f0f23]">
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
          <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="100vw" priority={current === 0} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#411dd3]/80 via-[#0f0f23]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23]/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary-400/20 text-secondary-300 border border-secondary-400/30 backdrop-blur-sm mb-4 tracking-wide">
                  {slide.title}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-lg">
                  {slide.highlight}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/85 mb-6 max-w-md leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={slide.cta.href}>
                    <Button size="lg" className="text-sm sm:text-base bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 border-0 shadow-lg text-white">
                      {slide.cta.label}
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  {slide.secondary && (
                    <Link href={slide.secondary.href}>
                      <Button variant="outline" size="lg" className="text-sm sm:text-base border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
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

      <button onClick={prev} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-500/30 backdrop-blur-md border border-primary-400/30 text-white flex items-center justify-center hover:bg-primary-500/50 hover:shadow-lg transition-all" aria-label="Previous slide">
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button onClick={next} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-500/30 backdrop-blur-md border border-primary-400/30 text-white flex items-center justify-center hover:bg-primary-500/50 hover:shadow-lg transition-all" aria-label="Next slide">
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2.5 bg-gradient-to-r from-secondary-400 to-primary-400"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
