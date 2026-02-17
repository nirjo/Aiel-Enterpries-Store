"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { useWishlistStore } from "@/stores/wishlist";
import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/lib/utils/format";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      quantity: 1,
    });
    removeItem(item.productId);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-200 rounded w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-surface-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface-100 py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li className="text-text-muted">/</li>
              <li className="text-text-primary font-medium">Wishlist</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-surface-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Save items you love to your wishlist. Review them anytime and easily move them to your cart.
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group relative bg-white rounded-2xl border border-surface-300 overflow-hidden hover:shadow-medium hover:border-surface-400 transition-all duration-300"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>

                  {/* Image */}
                  <Link href={`/products/${item.slug}`}>
                    <div className="relative aspect-square bg-surface-100 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <ShoppingCart className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium text-sm text-text-primary line-clamp-2 mb-2 hover:text-primary-500 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-lg text-primary-500">
                        {formatCurrency(item.price)}
                      </span>
                      {item.compareAtPrice && (
                        <span className="text-sm text-text-muted line-through">
                          {formatCurrency(item.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <Button
                      fullWidth
                      size="sm"
                      onClick={() => handleMoveToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
