"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/database";

// Mock product data - replace with Supabase fetch
const mockProduct: Product = {
  id: "1",
  name: "Wireless Bluetooth Headphones with Active Noise Cancellation",
  slug: "wireless-bluetooth-headphones",
  description: `
    <p>Experience premium audio with our Wireless Bluetooth Headphones featuring advanced Active Noise Cancellation technology. Designed for audiophiles and casual listeners alike, these headphones deliver crystal-clear sound quality with deep bass and crisp highs.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>Active Noise Cancellation (ANC) technology</li>
      <li>40mm premium drivers for immersive sound</li>
      <li>Up to 30 hours battery life</li>
      <li>Quick charge: 10 minutes for 3 hours playback</li>
      <li>Bluetooth 5.0 for stable connectivity</li>
      <li>Foldable design for easy portability</li>
      <li>Memory foam ear cushions for comfort</li>
      <li>Built-in microphone for calls</li>
    </ul>
    
    <h3>What's in the Box:</h3>
    <ul>
      <li>Wireless Headphones</li>
      <li>USB-C Charging Cable</li>
      <li>3.5mm Audio Cable</li>
      <li>Carrying Case</li>
      <li>User Manual</li>
    </ul>
  `,
  short_description: "Premium wireless headphones with ANC for immersive listening experience",
  price: 2499,
  compare_at_price: 3999,
  cost_price: 1500,
  sku: "WBH-001",
  barcode: null,
  category_id: "1",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
  ],
  thumbnail_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
  is_active: true,
  is_featured: true,
  tags: ["electronics", "audio", "headphones"],
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const relatedProducts: Product[] = [
  {
    id: "2",
    name: "Smart Watch with Heart Rate Monitor",
    slug: "smart-watch-heart-rate",
    description: "Feature-rich smartwatch with health tracking",
    short_description: "Smart fitness watch",
    price: 4999,
    compare_at_price: 6999,
    cost_price: 3000,
    sku: "SW-001",
    barcode: null,
    category_id: "1",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
    thumbnail_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    is_active: true,
    is_featured: true,
    tags: ["electronics", "wearable"],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Compact speaker with powerful bass",
    short_description: "Portable speaker",
    price: 1999,
    compare_at_price: 2999,
    cost_price: 1000,
    sku: "BS-001",
    barcode: null,
    category_id: "1",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"],
    thumbnail_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    is_active: true,
    is_featured: true,
    tags: ["electronics", "audio"],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const toast = useToast();

  const product = mockProduct; // Replace with actual fetch based on params.slug
  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0;

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

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface-100 py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-text-muted" />
              <li>
                <Link href="/products" className="text-text-muted hover:text-primary-500 transition-colors">
                  Products
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-text-muted" />
              <li className="text-text-primary font-medium line-clamp-1">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <Badge variant="error" className="absolute top-4 left-4">
                  -{discount}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
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
          </div>

          {/* Product info */}
          <div>
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

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
              <span className="text-sm text-text-secondary">4.2 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-primary-500">
                {formatCurrency(product.price)}
              </span>
              {product.compare_at_price && (
                <>
                  <span className="text-lg text-text-muted line-through">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                  <Badge variant="success">Save {formatCurrency(product.compare_at_price - product.price)}</Badge>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-text-secondary mb-6">{product.short_description}</p>

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
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface-100 transition-colors rounded-r-lg"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-text-muted">In stock</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-12">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
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

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-6">
            Product Description
          </h2>
          <div
            className="prose prose-sm max-w-none text-text-secondary"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
        </div>

        {/* Related products */}
        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      </div>
    </div>
  );
}
