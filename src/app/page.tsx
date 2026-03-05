import Link from "next/link";
import { ArrowRight, Zap, Shield, Rocket, Headphones, Flame, Sparkles, TrendingUp, Mail } from "lucide-react";
import { Button } from "@/components/ui";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ProductGrid } from "@/components/product";
import { CategoryCircles } from "@/components/product/CategoryCircles";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/database";

/* ═══════════════════════════════════════════════════════════════════════════
   FALLBACK DATA — used when Supabase is unavailable
   ═══════════════════════════════════════════════════════════════════════════ */

const fallbackCategories: Category[] = [
  { id: "1", name: "Aiel Toy Paradise", slug: "toys", description: "Fun toys for every age", image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Wooden Toys", slug: "wooden-toys", description: "Classic handcrafted wooden toys", image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Home & Kitchen", slug: "home-kitchen", description: "Smart kitchen & home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Electronics", slug: "electronics", description: "Gadgets & accessories", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Gardening", slug: "gardening", description: "Tools & planters", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Home Decor", slug: "home-decor", description: "Stylish decor pieces", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Stationery Items", slug: "stationery-items", description: "Notebooks & art supplies", image_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop", parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Sport & Exercise", slug: "sport-exercise", description: "Fitness gear", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Gift Items", slug: "gift-items", description: "Curated gifts", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop", parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
];

const fallbackProducts: Product[] = [
  { id: "1", name: "Pop-It Fidget Board", slug: "pop-it-fidget-board", description: "", short_description: "Rainbow silicone sensory toy", price: 299, compare_at_price: 499, cost_price: null, sku: "SNS-001", barcode: null, category_id: "1", images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600", is_active: true, is_featured: true, tags: ["toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "2", name: "Montessori Stacking Tower", slug: "montessori-stacking-tower", description: "", short_description: "Wooden rainbow stacking blocks", price: 1299, compare_at_price: 1799, cost_price: null, sku: "MON-001", barcode: null, category_id: "2", images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600", is_active: true, is_featured: true, tags: ["wooden-toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "3", name: "Magnetic Building Tiles 120pc", slug: "magnetic-building-tiles-120", description: "", short_description: "Colourful 3D magnetic construction set", price: 2199, compare_at_price: 2999, cost_price: null, sku: "EDU-001", barcode: null, category_id: "3", images: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600", is_active: true, is_featured: true, tags: ["toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "4", name: "Robotics Starter Kit Pro", slug: "robotics-starter-kit-pro", description: "", short_description: "Build & program your first robot", price: 4999, compare_at_price: 6999, cost_price: null, sku: "STM-001", barcode: null, category_id: "4", images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600", is_active: true, is_featured: true, tags: ["electronics"], metadata: {}, created_at: "", updated_at: "" },
  { id: "5", name: "Smart Kitchen Organizer", slug: "smart-kitchen-organizer", description: "", short_description: "Multi-tier rotating storage rack", price: 1599, compare_at_price: 2199, cost_price: null, sku: "HMK-001", barcode: null, category_id: "5", images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", is_active: true, is_featured: false, tags: ["home-kitchen"], metadata: {}, created_at: "", updated_at: "" },
  { id: "6", name: "Bluetooth Speaker Pro", slug: "bluetooth-speaker-pro", description: "", short_description: "Portable waterproof 20W speaker", price: 3499, compare_at_price: 4999, cost_price: null, sku: "ELC-001", barcode: null, category_id: "4", images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600", is_active: true, is_featured: true, tags: ["electronics"], metadata: {}, created_at: "", updated_at: "" },
  { id: "7", name: "Premium Notebook Set", slug: "premium-notebook-set", description: "", short_description: "A5 leather-bound journals, set of 3", price: 899, compare_at_price: 1299, cost_price: null, sku: "STN-001", barcode: null, category_id: "7", images: ["https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600", is_active: true, is_featured: false, tags: ["stationery-items"], metadata: {}, created_at: "", updated_at: "" },
  { id: "8", name: "Yoga Mat Premium", slug: "yoga-mat-premium", description: "", short_description: "Non-slip 6mm eco-friendly mat", price: 1299, compare_at_price: 1899, cost_price: null, sku: "SPT-001", barcode: null, category_id: "8", images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600", is_active: true, is_featured: false, tags: ["sport-exercise"], metadata: {}, created_at: "", updated_at: "" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST / FEATURES BADGES
   ═══════════════════════════════════════════════════════════════════════════ */

const trustBadges = [
  { icon: Rocket, title: "Free Shipping", description: "On orders over ₹999" },
  { icon: Shield, title: "Quality Assured", description: "Trusted products" },
  { icon: Zap, title: "Easy Returns", description: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", description: "Expert guidance" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA FETCHERS — Parallel Supabase queries with fallbacks
   ═══════════════════════════════════════════════════════════════════════════ */

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories").select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(12) as { data: Category[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackCategories;
    return data;
  } catch { return fallbackCategories; }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products").select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8) as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackProducts.filter(p => p.is_featured);
    return data;
  } catch { return fallbackProducts.filter(p => p.is_featured); }
}

async function getOnSaleProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products").select("*")
      .eq("is_active", true)
      .not("compare_at_price", "is", null)
      .order("compare_at_price", { ascending: false })
      .limit(8) as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackProducts;
    return data;
  } catch { return fallbackProducts; }
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products").select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8) as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackProducts;
    return data;
  } catch { return fallbackProducts; }
}

async function getBestsellers(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products").select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("price", { ascending: true })
      .limit(8) as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackProducts.filter(p => p.is_featured);
    return data;
  } catch { return fallbackProducts.filter(p => p.is_featured); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE — 8 Sections
   ═══════════════════════════════════════════════════════════════════════════ */

export default async function HomePage() {
  const [categories, featured, onSale, newArrivals, bestsellers] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getOnSaleProducts(),
    getNewArrivals(),
    getBestsellers(),
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ═══════════════════════════════════════════
          SECTION 1 — HEADER (in layout.tsx, auto)
          SECTION 2 — HERO / PROMO BANNER
          ═══════════════════════════════════════════ */}
      <HeroCarousel />

      {/* ═══════════════════════════════════════════
          SECTION 2.5 — TRUST BADGES (features bar)
          ═══════════════════════════════════════════ */}
      <section className="py-6 border-b border-pink-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="trust-badges-grid">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="trust-badge">
                <div className="trust-badge-icon">
                  <badge.icon className="h-5 w-5 text-[#e91e63]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-text-primary">{badge.title}</h3>
                  <p className="text-xs text-text-muted">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — CIRCULAR CATEGORY TABS
          ═══════════════════════════════════════════ */}
      <section className="homepage-section bg-gradient-to-b from-white to-[#fff8fa]">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div>
              <h2 className="font-display">🛍️ Shop by Category</h2>
              <p className="text-text-secondary mt-1 text-sm">Browse our curated collections</p>
            </div>
            <Link href="/categories" className="view-all-link">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CategoryCircles categories={categories} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — FEATURED PRODUCTS GRID
          ═══════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="homepage-section bg-gradient-to-br from-[#fff5f7] via-white to-[#ffeef2]">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="font-display flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[#e91e63]" />
                  Featured Products
                </h2>
                <p className="text-text-secondary mt-1 text-sm">Our most popular picks</p>
              </div>
              <Link href="/products?featured=true" className="view-all-link">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={featured} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 5 — SALE / ON SALE SECTION  
          ═══════════════════════════════════════════ */}
      {onSale.length > 0 && (
        <section className="homepage-section bg-white">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="font-display flex items-center gap-2">
                  <Flame className="h-6 w-6 text-red-500" />
                  <span>Hot Deals</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 animate-pulse">
                    SALE
                  </span>
                </h2>
                <p className="text-text-secondary mt-1 text-sm">Grab these before they&apos;re gone!</p>
              </div>
              <Link href="/products" className="view-all-link">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={onSale} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 6 — NEW ARRIVALS
          ═══════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="homepage-section bg-gradient-to-br from-[#fafafa] to-[#fff5f7]">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="font-display flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500" />
                  New Arrivals
                </h2>
                <p className="text-text-secondary mt-1 text-sm">Fresh additions to our store</p>
              </div>
              <Link href="/products?sort=newest" className="view-all-link">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 7 — BESTSELLERS / POPULAR
          ═══════════════════════════════════════════ */}
      {bestsellers.length > 0 && (
        <section className="homepage-section bg-white">
          <div className="container mx-auto px-4">
            <div className="section-header">
              <div>
                <h2 className="font-display flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-[#e91e63]" />
                  Bestsellers
                </h2>
                <p className="text-text-secondary mt-1 text-sm">Top selling items loved by customers</p>
              </div>
              <Link href="/products?featured=true" className="view-all-link">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={bestsellers} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SECTION 8 — NEWSLETTER + FOOTER
          ═══════════════════════════════════════════ */}
      <section className="newsletter-section homepage-section">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="h-7 w-7 text-[#e91e63]" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#333]">
              Stay in the Loop
            </h2>
          </div>
          <p className="text-[#666] text-sm md:text-base mb-6 max-w-md mx-auto">
            Get 10% off your first order + exclusive deals, new arrivals & sale alerts!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <Button
              size="lg"
              className="min-w-[120px] bg-[#e91e63] hover:bg-[#c2185b] text-white border-0 shadow-lg"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-[#999]">
            No spam, ever. Unsubscribe anytime. 🎉
          </p>
        </div>
      </section>

      {/* Footer is in layout.tsx — automatically rendered */}
    </div>
  );
}
