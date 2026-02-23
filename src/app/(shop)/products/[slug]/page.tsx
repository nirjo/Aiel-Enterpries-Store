"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductGrid, SpiceJarGallery } from "@/components/product";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

// ─── Skeleton Loader ────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="bg-surface-100 py-4 border-b border-surface-300 h-12" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-2xl bg-surface-200 mb-4" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-surface-200" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-surface-200 rounded w-1/4" />
            <div className="h-8 bg-surface-200 rounded w-3/4" />
            <div className="h-4 bg-surface-200 rounded w-1/2" />
            <div className="h-10 bg-surface-200 rounded w-1/3" />
            <div className="h-16 bg-surface-200 rounded" />
            <div className="h-12 bg-surface-200 rounded" />
            <div className="flex gap-4">
              <div className="h-12 bg-surface-200 rounded flex-1" />
              <div className="h-12 bg-surface-200 rounded w-12" />
              <div className="h-12 bg-surface-200 rounded w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Tiers (Spice Jar specific) ─────────────────────────────────────────
function PricingTiers() {
  return (
    <div className="rounded-xl border border-surface-300 bg-surface-50 overflow-hidden mb-6">
      <div className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold">
        ⚡ Special Pricing — Limited Time Offer
      </div>
      <div className="divide-y divide-surface-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-sm font-medium text-text-primary">Single Set</span>
            <span className="ml-2 text-xs text-text-muted line-through">₹1,499</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-500">₹799</span>
            <Badge variant="error" size="sm">47% OFF</Badge>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <span className="text-sm font-medium text-text-primary">Buy 2 Sets</span>
            <span className="ml-2 text-xs text-success-600">Save 10%</span>
          </div>
          <span className="text-lg font-bold text-text-primary">₹1,439</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <div>
            <span className="text-sm font-medium text-text-primary">Bulk 6+ Sets</span>
            <span className="ml-2 text-xs text-text-muted">For Resellers</span>
          </div>
          <span className="text-sm font-bold text-amber-700">₹450/unit · Contact Us</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const { addItem } = useCartStore();
  const toast = useToast();

  // ── Fetch product from Supabase ─────────────────────────────────────────────
  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const supabase = getSupabaseClient();

      const { data: raw, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !raw) {
        setNotFound(true);
        return;
      }

      const productData = raw as Product;
      setProduct(productData);
      setSelectedImage(0);

      // Fetch related products from same category
      if (productData.category_id) {
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", productData.category_id)
          .eq("is_active", true)
          .neq("id", productData.id)
          .limit(4);
        setRelatedProducts((related as Product[]) ?? []);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return <ProductSkeleton />;

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <Package className="h-16 w-16 text-text-muted" />
        <h1 className="text-2xl font-display font-bold text-text-primary">Product Not Found</h1>
        <p className="text-text-secondary text-center max-w-md">
          We couldn&apos;t find this product. It may have been removed or the link is incorrect.
        </p>
        <Link href="/products">
          <Button>Browse All Products</Button>
        </Link>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0;

  const isSpiceJar = product.slug === "premium-revolving-spice-jar-set";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      image: product.thumbnail_url,
      quantity,
    });
    toast.success("Added to cart", `${product.name} has been added to your cart`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!", "Product link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="bg-surface-100 py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-text-muted flex-shrink-0" />
              <li>
                <Link href="/products" className="text-text-muted hover:text-primary-500 transition-colors">
                  Products
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-text-muted flex-shrink-0" />
              <li className="text-text-primary font-medium line-clamp-1">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Image Gallery ─────────────────────────────────────────── */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 mb-4">
              {product.images?.[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {discount > 0 && (
                <Badge variant="error" className="absolute top-4 left-4">
                  -{discount}% OFF
                </Badge>
              )}
              {isSpiceJar && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    🌀 360° Revolving
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-primary-400 shadow-glow"
                        : "border-transparent hover:border-surface-400"
                    )}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ──────────────────────────────────────────── */}
          <div>
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < 4 ? "text-warning fill-warning" : "text-surface-400"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">4.7 (238 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary-500">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <>
                  <span className="text-lg text-text-muted line-through">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                  <Badge variant="success">
                    Save {formatCurrency(product.compare_at_price - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-text-secondary mb-4">{product.short_description}</p>
            )}

            {/* Pricing tiers — Spice Jar specific */}
            {isSpiceJar && <PricingTiers />}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-surface-400 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-100 transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-100 transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-text-muted">In stock · Ships fast</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} id="add-to-cart-btn">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-12"
                onClick={() => setWishlisted(!wishlisted)}
                aria-label="Add to wishlist"
              >
                <Heart className={cn("h-5 w-5", wishlisted && "fill-red-500 text-red-500")} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-12"
                onClick={handleShare}
                aria-label="Share product"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-surface-100 rounded-xl">
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <span className="text-xs text-text-secondary">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <span className="text-xs text-text-secondary">Secure Payment</span>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                <span className="text-xs text-text-secondary">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Supabase Storage Gallery (Spice Jar) ──────────────────────────── */}
        {isSpiceJar && (
          <div className="mt-12">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">
              Product Gallery
            </h2>
            <SpiceJarGallery productImages={product.images ?? []} />
          </div>
        )}

        {/* ── Full Description ──────────────────────────────────────────────── */}
        <div className="mt-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-6">
            Product Description
          </h2>
          <div
            className="prose prose-sm max-w-none text-text-secondary"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        </div>

        {/* ── Related Products ──────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
