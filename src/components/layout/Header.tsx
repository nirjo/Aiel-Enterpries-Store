"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils/cn";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, toggleCart } = useCartStore();
  const { toggleMobileMenu, isMobileMenuOpen, openSearch } = useUIStore();
  const itemCount = mounted ? getItemCount() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-soft"
            : "bg-white"
        )}
      >
        {/* Top bar */}
        <div className="bg-secondary-700 text-white text-xs py-1.5">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p>Free shipping on orders over ₹999</p>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/contact" className="hover:text-primary-400 transition-colors">
                Contact Us
              </Link>
              <Link href="/track" className="hover:text-primary-400 transition-colors">
                Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl text-secondary-700 hidden sm:block">
                {APP_NAME}
              </span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full h-10 pl-4 pr-12 rounded-full border border-surface-400 bg-surface-100 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
                />
                <button type="submit" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary-400 text-white flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search - mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={openSearch}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex items-center justify-center h-10 w-10 rounded-lg bg-transparent text-text-primary hover:bg-surface-200 active:bg-surface-300 transition-all duration-200"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-transparent text-text-primary hover:bg-surface-200 active:bg-surface-300 transition-all duration-200"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-400 text-white text-2xs font-medium flex items-center justify-center"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center gap-6 mt-3 pb-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  pathname === link.href
                    ? "text-primary-500"
                    : "text-text-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <button className="flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors">
              Categories <ChevronDown className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-28 md:h-36" />
    </>
  );
}
