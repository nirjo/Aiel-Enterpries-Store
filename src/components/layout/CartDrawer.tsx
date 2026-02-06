"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-strong flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-surface-300">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary-400" />
                Your Cart
                <span className="text-sm font-normal text-text-muted">
                  ({items.length} items)
                </span>
              </h2>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <div className="w-24 h-24 rounded-full bg-surface-200 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-text-muted" />
                  </div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                  <Button onClick={closeCart}>Start Shopping</Button>
                </div>
              ) : (
                <ul className="space-y-4 px-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-3 bg-surface-100 rounded-xl"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-200 flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium text-sm text-text-primary hover:text-primary-500 line-clamp-2 transition-colors"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm text-primary-500">
                            {formatCurrency(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="text-xs text-text-muted line-through">
                              {formatCurrency(item.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-surface-400 flex items-center justify-center hover:bg-surface-200 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-surface-400 flex items-center justify-center hover:bg-surface-200 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-text-muted hover:text-error transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-surface-300 px-4 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/cart" onClick={closeCart}>
                    <Button variant="outline" fullWidth>
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={closeCart}>
                    <Button fullWidth>Checkout</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
