"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  Star, Heart, Share2, Minus, Plus, ShoppingCart,
  Truck, Shield, RefreshCw, ChevronRight, Package,
  ZoomIn, X, ChevronLeft, ChevronDown, CreditCard,
  Check,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductGrid, SpiceJarGallery } from "@/components/product";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="bg-surface-100 py-4 border-b border-surface-300 h-12" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-2xl bg-surface-200 mb-4" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
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
            <div className="flex gap-3">
              <div className="h-12 bg-surface-200 rounded flex-1" />
              <div className="h-12 bg-surface-200 rounded flex-1" />
              <div className="h-12 bg-surface-200 rounded w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  current,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  current: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full max-w-3xl max-h-[80vh] aspect-square mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt="Product image"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); }}
            className={cn(
              "relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
              i === current ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
            )}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Collapsible Section ─────────────────────────────────────────────────────
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-surface-300 rounded-2xl overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between px-6 py-4 bg-surface-50 hover:bg-surface-100 transition-colors text-left group"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary-500">{icon}</span>}
          <span className="font-semibold text-text-primary text-base">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-text-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open ? (contentRef.current ? contentRef.current.scrollHeight + "px" : "1000px") : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-6 py-5 text-text-secondary text-sm leading-relaxed border-t border-surface-200">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── SVG Image Frame ─────────────────────────────────────────────────────────
function SvgImageFrame({ src, alt, selected, onClick, priority = false }: {
  src: string; alt: string; selected?: boolean; onClick?: () => void; priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative group cursor-zoom-in transition-all duration-300",
        selected && "scale-[1.02]"
      )}
      onClick={onClick}
    >
      {/* Decorative SVG border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1" y="1" width="98" height="98"
          rx="12" ry="12"
          fill="none"
          stroke={selected ? "url(#grad)" : "rgba(200,200,220,0.4)"}
          strokeWidth={selected ? "2.5" : "1"}
          strokeDasharray={selected ? "0" : "6 4"}
        />
        {selected && (
          <>
            {/* Corner accents */}
            <polyline points="1,18 1,1 18,1" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
            <polyline points="82,1 99,1 99,18" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
            <polyline points="1,82 1,99 18,99" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
            <polyline points="99,82 99,99 82,99" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-100">
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            "group-hover:scale-110"
          )}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Zoom icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Tiers (Spice Jar specific) ──────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { addItem: addToCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const toast = useToast();

  // ── Fetch product ───────────────────────────────────────────────────────────
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

      if (error || !raw) { setNotFound(true); return; }
      const productData = raw as Product;
      setProduct(productData);
      setSelectedImage(0);

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
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  // ── Derive images early (before early returns) so hooks below are unconditional
  const images = product?.images ?? (product?.thumbnail_url ? [product.thumbnail_url] : []);

  // ── Carousel callbacks — MUST be above early returns (Rules of Hooks) ────────
  const slideToIndex = useCallback((next: number, dir: "left" | "right") => {
    if (isAnimating || next === selectedImage) return;
    setSlideDir(dir);
    setIsAnimating(true);
    setSelectedImage(next);
    setTimeout(() => {
      setIsAnimating(false);
      setSlideDir(null);
    }, 380);
    setTimeout(() => {
      const strip = thumbsRef.current;
      if (!strip) return;
      const thumb = strip.children[next] as HTMLElement;
      if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, 50);
  }, [isAnimating, selectedImage]);

  const goPrev = useCallback(() => {
    const next = (selectedImage - 1 + images.length) % images.length;
    slideToIndex(next, "right");
  }, [selectedImage, images.length, slideToIndex]);

  const goNext = useCallback(() => {
    const next = (selectedImage + 1) % images.length;
    slideToIndex(next, "left");
  }, [selectedImage, images.length, slideToIndex]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext(); else goPrev();
  };

  // ── Early returns (after all hooks) ─────────────────────────────────────────
  if (loading) return <ProductSkeleton />;

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <Package className="h-16 w-16 text-text-muted" />
        <h1 className="text-2xl font-display font-bold text-text-primary">Product Not Found</h1>
        <p className="text-text-secondary text-center max-w-md">
          We couldn&apos;t find this product. It may have been removed or the link is incorrect.
        </p>
        <Link href="/products"><Button>Browse All Products</Button></Link>
      </div>
    );
  }

  const discount = product.compare_at_price ? calculateDiscount(product.price, product.compare_at_price) : 0;
  const isSpiceJar = product.slug === "premium-revolving-spice-jar-set";
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      image: product.thumbnail_url,
      quantity,
    });
    toast.success("Added to cart! 🛒", `${product.name} has been added to your cart`);
  };

  const handleCheckout = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlist = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      image: product.thumbnail_url,
    });
    if (wishlisted) {
      toast.success("Removed from Wishlist", `${product.name} removed from wishlist`);
    } else {
      toast.success("Added to Wishlist ❤️", `${product.name} saved to your wishlist`);
    }
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
      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          current={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="bg-surface-50 border-b border-surface-200 pt-6 pb-4 shadow-sm">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-start gap-2 flex-wrap text-sm">
              <li className="flex items-center gap-2 flex-shrink-0">
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0 mt-0.5" />
              <li className="flex items-center gap-2 flex-shrink-0">
                <Link href="/products" className="text-text-muted hover:text-primary-500 transition-colors font-medium">
                  Products
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0 mt-0.5" />
              <li className="text-text-primary font-semibold line-clamp-2 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl leading-snug">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Image Carousel ────────────────────────────────────────────── */}
          <div className="space-y-3">
            {/* ── Main sliding frame ── */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 shadow-md select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides */}
              <div
                className="absolute inset-0"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                }}
              >
                {images.map((img, i) => {
                  const isActive = i === selectedImage;

                  return (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{
                        transform: `translateX(${isActive ? "0%" : (i < selectedImage ? "-100%" : "100%")})`,
                        transition: isAnimating ? "transform 0.36s cubic-bezier(0.4,0,0.2,1)" : "none",
                        zIndex: isActive ? 1 : 0,
                        willChange: "transform",
                      }}
                      aria-hidden={!isActive}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} — image ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Discount badge */}
              {discount > 0 && (
                <Badge variant="error" className="absolute top-4 left-4 z-10 shadow-md">
                  -{discount}% OFF
                </Badge>
              )}

              {/* Counter pill */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}

              {/* Prev / Next arrows — always visible on mobile, hover on desktop */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {images.length > 1 && images.length <= 8 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => slideToIndex(i, i > selectedImage ? "left" : "right")}
                      aria-label={`Go to image ${i + 1}`}
                      className={cn(
                        "rounded-full transition-all duration-300 touch-manipulation",
                        i === selectedImage
                          ? "w-5 h-2 bg-white shadow"
                          : "w-2 h-2 bg-white/50 hover:bg-white/75"
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Zoom tap target */}
              <button
                className="absolute inset-0 z-[2] cursor-zoom-in"
                style={{ background: "transparent" }}
                onClick={() => setLightboxOpen(true)}
                aria-label="Open full-screen view"
              />
            </div>

            {/* ── Thumbnail strip ── */}
            {images.length > 1 && (
              <div
                ref={thumbsRef}
                className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => slideToIndex(i, i > selectedImage ? "left" : "right")}
                    className={cn(
                      "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start touch-manipulation",
                      i === selectedImage
                        ? "border-primary-400 ring-2 ring-primary-300 ring-offset-1 scale-105"
                        : "border-transparent hover:border-surface-400 hover:scale-105 active:scale-95 opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === selectedImage}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
                <div className="hidden sm:flex items-center gap-1 text-xs text-text-muted ml-1 flex-shrink-0 self-center">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Tap to zoom
                </div>
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────────────── */}
          <div>
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < 4 ? "text-warning fill-warning" : "text-surface-400")} />
                ))}
              </div>
              <span className="text-sm text-text-secondary">4.7 · 238 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold text-primary-500">{formatCurrency(product.price)}</span>
              {product.compare_at_price && (
                <>
                  <span className="text-lg text-text-muted line-through">{formatCurrency(product.compare_at_price)}</span>
                  <Badge variant="success">Save {formatCurrency(product.compare_at_price - product.price)}</Badge>
                </>
              )}
            </div>
            <p className="text-xs text-text-muted mb-5">Inclusive of all taxes · Free delivery available</p>

            {/* Short description */}
            {product.short_description && (
              <p className="text-text-secondary mb-5 text-sm leading-relaxed border-l-2 border-primary-300 pl-4 bg-surface-50 py-2 rounded-r-lg">
                {product.short_description}
              </p>
            )}

            {/* Pricing tiers — Spice Jar specific */}
            {isSpiceJar && <PricingTiers />}

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-text-primary mb-2 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-surface-400 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-surface-100 active:bg-surface-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-text-primary select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-surface-100 active:bg-surface-200 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-success-600">
                  <Check className="h-4 w-4" />
                  <span className="hidden xs:inline">In stock · </span>Ships in 2-3 days
                </div>
              </div>
            </div>

            {/* ── Action Buttons ──────────────────────────────────────────── */}
            <div className="space-y-3 mb-8">
              {/* Row 1: Add to Cart (full-width on mobile, flex-1 on larger) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  id="add-to-cart-btn"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>

                {/* Wishlist + Share side-by-side on all sizes */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "flex-1 sm:flex-none gap-2 transition-all duration-300 border-2",
                      wishlisted
                        ? "border-red-400 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-surface-400 hover:border-red-300 hover:text-red-500"
                    )}
                    onClick={handleWishlist}
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={cn("h-5 w-5 transition-all", wishlisted && "fill-red-500 text-red-500")} />
                    <span className="text-sm font-medium">
                      {wishlisted ? "Wishlisted" : "Wishlist"}
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[48px] w-12 px-0"
                    onClick={handleShare}
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Row 2: Proceed to Checkout — always full width */}
              <Button
                size="lg"
                className="w-full gap-2"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6366f1 100%)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                }}
                onClick={handleCheckout}
                id="checkout-btn"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-200">
              <div className="text-center">
                <Truck className="h-6 w-6 text-primary-500 mx-auto mb-1.5" />
                <span className="text-xs text-text-secondary font-medium block">Free Shipping</span>
                <span className="text-xs text-text-muted">₹499+</span>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-primary-500 mx-auto mb-1.5" />
                <span className="text-xs text-text-secondary font-medium block">Secure Pay</span>
                <span className="text-xs text-text-muted">SSL 256-bit</span>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-primary-500 mx-auto mb-1.5" />
                <span className="text-xs text-text-secondary font-medium block">Easy Returns</span>
                <span className="text-xs text-text-muted">7-day policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Supabase Storage Gallery (Spice Jar) ───────────────────────────── */}
        {isSpiceJar && (
          <div className="mt-14">
            <h2 className="text-xl font-display font-bold text-text-primary mb-4">Product Gallery</h2>
            <SpiceJarGallery productImages={product.images ?? []} />
          </div>
        )}

        {/* ── Collapsible Info Sections ────────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="text-xl font-display font-bold text-text-primary mb-6">Product Details</h2>

          {/* Description */}
          <CollapsibleSection
            title="Product Description"
            defaultOpen={true}
            icon={<Package className="h-5 w-5" />}
          >
            {product.description ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p>{product.short_description || "No description available for this product."}</p>
            )}
          </CollapsibleSection>

          {/* Shipping & Delivery */}
          <CollapsibleSection
            title="Shipping & Delivery"
            icon={<Truck className="h-5 w-5" />}
          >
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Free standard delivery on orders above ₹499</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Estimated delivery: 2–5 business days</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Express delivery available at checkout</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Tracking details sent via SMS and email</span></li>
            </ul>
          </CollapsibleSection>

          {/* Returns */}
          <CollapsibleSection
            title="Return & Refund Policy"
            icon={<RefreshCw className="h-5 w-5" />}
          >
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>7-day hassle-free return window</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Item must be unused and in original packaging</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Full refund or exchange offered</span></li>
              <li className="flex items-start gap-2"><Check className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" /><span>Damaged/defective items replaced free of charge</span></li>
            </ul>
          </CollapsibleSection>

          {/* Secure Payment */}
          <CollapsibleSection
            title="Secure Payment"
            icon={<Shield className="h-5 w-5" />}
          >
            <p className="mb-3">We accept multiple secure payment methods:</p>
            <div className="flex flex-wrap gap-2">
              {["UPI / GPay", "Credit Card", "Debit Card", "Net Banking", "EMI", "Cash on Delivery"].map((m) => (
                <span key={m} className="px-3 py-1 rounded-full bg-surface-100 border border-surface-300 text-xs font-medium text-text-primary">
                  {m}
                </span>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* ── Related Products ────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">You May Also Like</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
