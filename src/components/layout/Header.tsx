"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils/cn";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const searchParamsObj = useSearchParams();
  const router = useRouter();
  const { getItemCount, toggleCart } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();
  const { toggleMobileMenu, isMobileMenuOpen, openSearch } = useUIStore();
  const itemCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleMenuEnter = (label: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setActiveMenu(null); }, [pathname]);

  const getCategorySlug = (href: string) => {
    const match = href.match(/category=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-gradient-to-r from-primary-900/98 via-[#0f0f23]/98 to-secondary-900/90 backdrop-blur-xl shadow-2xl"
            : "bg-gradient-to-r from-primary-800/98 to-secondary-800/90"
        )}
      >
        {/* Top bar */}
        <div className="bg-primary-900/60 text-white/50 text-xs py-1.5 border-b border-primary-500/20">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p>🚀 Free shipping on anti-gravity orders over ₹999</p>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/contact" className="hover:text-lime-400 transition-colors">
                Contact Us
              </Link>
              <Link href="/track" className="hover:text-lime-400 transition-colors">
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-400 flex items-center justify-center shadow-[0_0_20px_rgba(65,29,211,0.3)]">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-display font-bold text-xl text-white/95 hidden sm:block tracking-wide">
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
                  placeholder="Search anti-gravity toys..."
                  className="w-full h-10 pl-4 pr-12 rounded-full border border-primary-500/30 bg-white/8 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-secondary-400/60 focus:ring-2 focus:ring-secondary-400/20 transition-all backdrop-blur-sm"
                />
                <button type="submit" className="absolute right-1 top-1 h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white flex items-center justify-center hover:from-primary-600 hover:to-secondary-500 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="md:hidden text-white/80 hover:bg-primary-500/20 hover:text-white" onClick={openSearch}>
                <Search className="h-5 w-5" />
              </Button>

              <Link href="/wishlist" className="hidden sm:flex items-center justify-center h-10 w-10 rounded-lg text-white/70 hover:bg-primary-500/20 hover:text-accent-400 transition-all duration-200 relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent-500 text-white text-[10px] font-medium flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/account" className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-white/70 hover:bg-primary-500/20 hover:text-white transition-all duration-200">
                <User className="h-5 w-5" />
              </Link>

              <Button variant="ghost" size="icon" className="relative text-white/80 hover:bg-primary-500/20 hover:text-white" onClick={toggleCart}>
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent-500 text-white text-2xs font-medium flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="md:hidden text-white/80 hover:bg-primary-500/20 hover:text-white" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center gap-1 mt-3 pb-1">
            {NAV_LINKS.map((link: NavLink) => {
              const search = searchParamsObj.toString();
              const fullPath = search ? `${pathname}?${search}` : pathname;
              const isActive = link.href === "/" ? pathname === "/" : fullPath === link.href || (link.href === "/products" && pathname === "/products" && !search);
              const hasSubmenu = link.subcategories && link.subcategories.length > 0;

              return (
                <div key={link.href} className="relative" onMouseEnter={() => hasSubmenu && handleMenuEnter(link.label)} onMouseLeave={handleMenuLeave}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:text-white hover:bg-white/10 whitespace-nowrap",
                      isActive ? "text-secondary-400 bg-white/10" : "text-white/70",
                      activeMenu === link.label && "text-secondary-400 bg-white/10"
                    )}
                  >
                    {link.label}
                    {hasSubmenu && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", activeMenu === link.label && "rotate-180")} />}
                  </Link>

                  {/* Mega menu dropdown */}
                  <AnimatePresence>
                    {hasSubmenu && activeMenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                        onMouseEnter={() => handleMenuEnter(link.label)}
                        onMouseLeave={handleMenuLeave}
                      >
                        <div className="bg-[#0f0f23]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-500/20 p-5 min-w-[680px]">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary-500/20">
                            <h3 className="font-display font-bold text-white/95 text-base tracking-wide">{link.label}</h3>
                            <Link href={link.href} className="text-xs font-medium text-secondary-400 hover:text-secondary-300 transition-colors">View All →</Link>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {link.subcategories!.map((sub) => {
                              const categorySlug = getCategorySlug(link.href);
                              return (
                                <Link
                                  key={sub.slug}
                                  href={`/products?category=${categorySlug}&sub=${sub.slug}`}
                                  className="group/card flex flex-col rounded-xl overflow-hidden border border-primary-500/15 hover:border-secondary-400/40 hover:shadow-[0_0_20px_rgba(29,211,156,0.1)] transition-all duration-300"
                                >
                                  <div className="relative h-24 w-full overflow-hidden bg-primary-900/30">
                                    <Image src={sub.image} alt={sub.label} fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="160px" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23]/50 to-transparent" />
                                  </div>
                                  <div className="p-2.5">
                                    <p className="text-xs font-semibold text-white/90 group-hover/card:text-secondary-400 transition-colors leading-tight">{sub.label}</p>
                                    <p className="text-[10px] text-white/40 mt-0.5 leading-tight line-clamp-1">{sub.description}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="h-28 md:h-36" />
    </>
  );
}
