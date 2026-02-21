import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Rocket, Headphones } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ProductGrid } from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import type { Product, Category } from "@/types/database";

const features = [
  {
    icon: Rocket,
    title: "Free Shipping",
    description: "On orders over ₹999",
  },
  {
    icon: Shield,
    title: "Parent Approved",
    description: "100% safe for kids",
  },
  {
    icon: Zap,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert toy guidance",
  },
];

// Fallback categories — anti-gravity themed
const fallbackCategories: Category[] = [
  {
    id: "1", name: "Levitation Toys", slug: "levitation-toys",
    description: "Magnetic floating gadgets", image_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Gyroscopes & Spinners", slug: "gyroscopes",
    description: "Precision spinning magic", image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "STEM Kits", slug: "stem-kits",
    description: "Hands-on science fun", image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Magnetic Gadgets", slug: "magnetic-gadgets",
    description: "Feel the magnetic force", image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "5", name: "Space & Gravity", slug: "space-gravity",
    description: "Explore cosmic wonders", image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "",
  },
];

const fallbackProducts: Product[] = [
  {
    id: "1", name: "Magnetic Levitation Globe", slug: "mag-lev-globe",
    description: "", short_description: "Floating world globe with LED base", price: 2999, compare_at_price: 4499,
    cost_price: null, sku: "LEV-001", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600",
    is_active: true, is_featured: true, tags: ["lev-globes"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Precision Gyroscope Pro", slug: "precision-gyroscope-pro",
    description: "", short_description: "CNC-machined metal gyroscope", price: 1899, compare_at_price: 2499,
    cost_price: null, sku: "GYR-001", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
    is_active: true, is_featured: true, tags: ["precision-gyros"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "Feel Flux Original", slug: "feel-flux-original",
    description: "", short_description: "Gravity-defying magnetic tube", price: 3499, compare_at_price: 4999,
    cost_price: null, sku: "STM-001", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600",
    is_active: true, is_featured: true, tags: ["feel-flux"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Ferrofluid Display Bottle", slug: "ferrofluid-display",
    description: "", short_description: "Mesmerizing magnetic liquid art", price: 1499, compare_at_price: 1999,
    cost_price: null, sku: "MAG-001", barcode: null, category_id: "4",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
    is_active: true, is_featured: true, tags: ["ferrofluid"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "5", name: "Planetarium Star Projector", slug: "planetarium-star-projector",
    description: "", short_description: "Project the cosmos on your ceiling", price: 2499, compare_at_price: 3499,
    cost_price: null, sku: "SPC-001", barcode: null, category_id: "5",
    images: ["https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600",
    is_active: true, is_featured: true, tags: ["planetarium"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "6", name: "Hover UFO Controller", slug: "hover-ufo-controller",
    description: "", short_description: "Hand-controlled hovering drone", price: 999, compare_at_price: 1499,
    cost_price: null, sku: "LEV-002", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1601892782225-e7a4a27d0e5c?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1601892782225-e7a4a27d0e5c?w=600",
    is_active: true, is_featured: false, tags: ["hover-ufo"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "7", name: "Robotics Starter Kit", slug: "robotics-starter-kit",
    description: "", short_description: "Build & program your first robot", price: 4999, compare_at_price: 6999,
    cost_price: null, sku: "STM-002", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    is_active: true, is_featured: true, tags: ["robotics-starter"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "8", name: "Euler's Disk Chrome", slug: "eulers-disk-chrome",
    description: "", short_description: "Hypnotic spinning chrome disk", price: 1299, compare_at_price: null,
    cost_price: null, sku: "GYR-002", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1504610926078-a1611562236f?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1504610926078-a1611562236f?w=600",
    is_active: true, is_featured: false, tags: ["eulers-disk"], metadata: {}, created_at: "", updated_at: "",
  },
];

// Get subcategories for home page display
const allSubcategories = NAV_LINKS
  .filter((link: NavLink) => link.subcategories && link.subcategories.length > 0)
  .flatMap((link: NavLink) => {
    const categorySlug = link.href.match(/category=([^&]+)/)?.[1] || "";
    return (link.subcategories || []).slice(0, 3).map((sub) => ({
      ...sub,
      categorySlug,
      categoryLabel: link.label,
    }));
  })
  .slice(0, 12);

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(8) as { data: Category[] | null; error: unknown };

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }
    return data;
  } catch {
    return fallbackCategories;
  }
}

async function getProducts(): Promise<{ featured: Product[]; all: Product[] }> {
  try {
    const supabase = await createClient();
    
    const { data: allProducts, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8) as { data: Product[] | null; error: unknown };

    if (error || !allProducts || allProducts.length === 0) {
      return {
        featured: fallbackProducts.filter((p) => p.is_featured),
        all: fallbackProducts,
      };
    }

    return {
      featured: allProducts.filter((p) => p.is_featured),
      all: allProducts,
    };
  } catch {
    return {
      featured: fallbackProducts.filter((p) => p.is_featured),
      all: fallbackProducts,
    };
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features bar */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0 border border-primary-200">
                  <feature.icon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-wide">Shop by Category</h2>
              <p className="text-gray-500 mt-1">Explore our anti-gravity collections</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:text-primary-600 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Image src={category.image_url || ""} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-bold text-white text-sm md:text-base tracking-wide">{category.name}</h3>
                  <p className="text-white/80 text-xs mt-0.5 font-medium">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Subcategories */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-wide">Browse Collections</h2>
              <p className="text-gray-500 mt-1">Find the perfect physics toy</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allSubcategories.map((sub) => (
              <Link
                key={`${sub.categorySlug}-${sub.slug}`}
                href={`/products?category=${sub.categorySlug}&sub=${sub.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Image
                  src={sub.image}
                  alt={sub.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-semibold leading-tight">{sub.label}</p>
                  <p className="text-white/70 text-[10px] mt-0.5 font-medium">{sub.categoryLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.featured.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-wide">Featured Products</h2>
                <p className="text-gray-500 mt-1">Our most mesmerizing picks</p>
              </div>
              <Link href="/products?featured=true" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:text-primary-600 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={products.featured} />
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-wide">New Arrivals</h2>
              <p className="text-gray-500 mt-1">Latest anti-gravity gadgets</p>
            </div>
            <Link href="/products?sort=newest" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:text-primary-600 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={products.all} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-wide">Launch Into Savings 🚀</h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">Get 20% off your first anti-gravity toy order. Join our space crew!</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-colors backdrop-blur-sm" />
            <Button variant="secondary" size="lg" className="min-w-[120px] bg-white text-primary-500 hover:bg-white/90">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
