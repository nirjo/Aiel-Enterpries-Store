"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  ShoppingBag,
  User,
  Heart,
  Package,
  Phone,
  ChevronDown,
} from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils/cn";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "Account", href: "/account", icon: User },
  { label: "Contact", href: "/contact", icon: Phone },
];

// Get only category links (those with subcategories)
const categoryLinks = NAV_LINKS.filter(
  (link: NavLink) => link.subcategories && link.subcategories.length > 0
);

export function MobileNav() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
    setExpandedCategory(null);
  }, [pathname, closeMobileMenu]);

  const toggleCategory = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? null : label));
  };

  const getCategorySlug = (href: string) => {
    const match = href.match(/category=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#0A0A2E] z-50 shadow-[0_0_40px_rgba(0,123,255,0.15)] flex flex-col md:hidden border-r border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={closeMobileMenu}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                  <span className="text-white font-bold text-base">A</span>
                </div>
                <span className="font-display font-bold text-lg text-white tracking-wide">
                  Aiel
                </span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4">
              {/* Quick links */}
              <ul className="space-y-1 px-3 mb-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          isActive
                            ? "bg-accent-400/10 text-accent-400"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Category sections with subcategories */}
              <div className="px-3">
                <h3 className="px-4 text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
                  Shop by Category
                </h3>
                <div className="space-y-1">
                  {categoryLinks.map((cat: NavLink) => {
                    const isExpanded = expandedCategory === cat.label;
                    const categorySlug = getCategorySlug(cat.href);

                    return (
                      <div key={cat.href}>
                        {/* Category header */}
                        <button
                          onClick={() => toggleCategory(cat.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            isExpanded
                              ? "bg-accent-400/10 text-accent-400"
                              : "text-white/60 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <span>{cat.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        {/* Subcategory list */}
                        <AnimatePresence>
                          {isExpanded && cat.subcategories && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pr-2 py-2 space-y-1">
                                {/* View all link */}
                                <Link
                                  href={cat.href}
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-accent-400 hover:bg-accent-400/10 transition-colors"
                                >
                                  View All {cat.label} →
                                </Link>

                                {cat.subcategories.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/products?category=${categorySlug}&sub=${sub.slug}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                                  >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                                      <Image
                                        src={sub.image}
                                        alt={sub.label}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-white group-hover:text-accent-400 transition-colors">
                                        {sub.label}
                                      </p>
                                      <p className="text-[10px] text-text-muted line-clamp-1">
                                        {sub.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-4">
              <Link
                href="/account"
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-primary-400 to-accent-400 text-white font-medium hover:from-primary-500 hover:to-accent-500 transition-colors"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
