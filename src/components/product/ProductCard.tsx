"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);
  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      image: product.thumbnail_url || product.images?.[0] || null,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="relative bg-white rounded-2xl border border-surface-300 overflow-hidden transition-all duration-300 hover:shadow-medium hover:border-surface-400">
          {/* Image container */}
          <div className="relative aspect-square bg-surface-100 overflow-hidden">
            {product.thumbnail_url || product.images?.[0] ? (
              <Image
                src={product.thumbnail_url || product.images[0]}
                alt={product.name}
                fill
                priority={priority}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <ShoppingCart className="h-12 w-12" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="error" size="sm">
                  -{discount}%
                </Badge>
              )}
              {product.is_featured && (
                <Badge variant="info" size="sm">
                  Featured
                </Badge>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleItem({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    compareAtPrice: product.compare_at_price,
                    image: product.thumbnail_url || product.images?.[0] || null,
                  });
                }}
                className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-surface-100 transition-colors"
              >
                <Heart className={cn("h-4 w-4", wishlisted ? "text-red-500 fill-red-500" : "text-text-secondary")} />
              </button>
            </div>

            {/* Add to cart button */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              <Button
                fullWidth
                size="sm"
                onClick={handleAddToCart}
                className="shadow-medium"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < 4
                        ? "text-warning fill-warning"
                        : "text-surface-400"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">(24)</span>
            </div>

            {/* Title */}
            <h3 className="font-medium text-sm text-text-primary line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg text-primary-500">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-text-muted line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
