"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, ShoppingBag, User, Heart, Package, Phone, ChevronDown } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { BrandLogo } from "@/components/ui/BrandLogo";
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

const categoryLinks = NAV_LINKS.filter(
  (link: NavLink) => link.subcategories && link.subcategories.length > 0
);

export function MobileNav() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobileMenu} className="fixed inset-0 bg-black/30 z-50 md:hidden" />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-[0_0_40px_rgba(255,182,193,0.3)] flex flex-col md:hidden border-r-2 border-[var(--header-border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--header-border)]">
              <Link href="/" onClick={closeMobileMenu}>
                <BrandLogo size="sm" showName variant="light" />
              </Link>
              <button onClick={closeMobileMenu} className="w-9 h-9 rounded-lg hover:bg-[var(--cat-hover)] flex items-center justify-center transition-colors text-[var(--header-text)]/50">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4">
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
                          isActive ? "bg-[var(--cat-hover)] text-[#e91e63]" : "text-[var(--header-text)]/60 hover:bg-[var(--cat-hover)] hover:text-[var(--header-text)]"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="px-3">
                <h3 className="px-4 text-xs font-semibold text-[var(--cat-text)]/50 uppercase tracking-wider mb-2">Shop by Category</h3>
                <div className="space-y-1">
                  {categoryLinks.map((cat: NavLink) => {
                    const isExpanded = expandedCategory === cat.label;
                    const categorySlug = getCategorySlug(cat.href);
                    return (
                      <div key={cat.href}>
                        <button
                          onClick={() => toggleCategory(cat.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                            isExpanded ? "bg-[var(--cat-hover)] text-[#e91e63]" : "text-[var(--header-text)]/60 hover:bg-[var(--cat-hover)] hover:text-[var(--header-text)]"
                          )}
                        >
                          <span>{cat.label}</span>
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {isExpanded && cat.subcategories && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="pl-4 pr-2 py-2 space-y-1">
                                <Link href={cat.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#e91e63] hover:bg-[var(--cat-hover)] transition-colors">
                                  View All {cat.label} →
                                </Link>
                                {cat.subcategories.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={`/products?category=${categorySlug}&sub=${sub.slug}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--cat-hover)] transition-colors group"
                                  >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--header-accent)] border border-[var(--header-border)]">
                                      <Image src={sub.image} alt={sub.label} fill className="object-cover" sizes="40px" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-[var(--header-text)]/80 group-hover:text-[#e91e63] transition-colors">{sub.label}</p>
                                      <p className="text-[10px] text-[var(--cat-text)]/40 line-clamp-1">{sub.description}</p>
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

            <div className="border-t border-[var(--header-border)] px-4 py-4">
              <Link
                href="/account"
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-[#f48fb1] to-[#e91e63] text-white font-medium hover:from-[#e91e63] hover:to-[#c2185b] transition-colors"
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
