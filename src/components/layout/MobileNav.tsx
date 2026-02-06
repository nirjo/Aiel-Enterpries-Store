"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, ShoppingBag, Grid3X3, User, Heart, Package, Phone } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils/cn";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: ShoppingBag },
  { label: "Categories", href: "/categories", icon: Grid3X3 },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "Account", href: "/account", icon: User },
  { label: "Contact", href: "/contact", icon: Phone },
];

export function MobileNav() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const pathname = usePathname();

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
  }, [pathname, closeMobileMenu]);

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
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-strong flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-surface-300">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={closeMobileMenu}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold text-base">A</span>
                </div>
                <span className="font-display font-bold text-lg text-secondary-700">
                  Aiel
                </span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="w-9 h-9 rounded-lg hover:bg-surface-200 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
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
                            ? "bg-primary-50 text-primary-500"
                            : "text-text-secondary hover:bg-surface-200"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-surface-300 px-4 py-4">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary-400 text-white font-medium hover:bg-primary-500 transition-colors"
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
