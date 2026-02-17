import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/database";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ₹999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support",
  },
];

// Fallback data when database is empty
const fallbackCategories: Category[] = [
  {
    id: "1", name: "Electronics", slug: "electronics",
    description: "Latest gadgets", image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Fashion", slug: "fashion",
    description: "Trendy fashion", image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "Home & Living", slug: "home-living",
    description: "Beautiful decor", image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Sports", slug: "sports",
    description: "Fitness gear", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "5", name: "Toys", slug: "toys",
    description: "Fun for everyone", image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "",
  },
  {
    id: "6", name: "Home Appliances", slug: "home-appliances",
    description: "Smart home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "",
  },
];

const fallbackProducts: Product[] = [
  {
    id: "1", name: "Wireless Bluetooth Headphones", slug: "wireless-bluetooth-headphones",
    description: "", short_description: "Premium ANC headphones", price: 2499, compare_at_price: 3999,
    cost_price: null, sku: "WBH-001", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    is_active: true, is_featured: true, tags: [], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Smart Watch with Heart Rate", slug: "smart-watch-heart-rate",
    description: "", short_description: "Smart fitness watch", price: 4999, compare_at_price: 6999,
    cost_price: null, sku: "SW-001", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    is_active: true, is_featured: true, tags: [], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt",
    description: "", short_description: "Soft cotton tee", price: 599, compare_at_price: 899,
    cost_price: null, sku: "TS-001", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    is_active: true, is_featured: false, tags: [], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Minimalist Desk Lamp", slug: "minimalist-desk-lamp",
    description: "", short_description: "Stylish desk lamp", price: 1299, compare_at_price: null,
    cost_price: null, sku: "DL-001", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    is_active: true, is_featured: true, tags: [], metadata: {}, created_at: "", updated_at: "",
  },
];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-700 via-secondary-600 to-secondary-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-primary-400/20 text-primary-300 border-primary-400/30 mb-4">
                ✨ New Collection Available
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Discover Your
                <span className="text-primary-400"> Style</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Shop the latest trends with premium quality products. 
                Free shipping on your first order over ₹999.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="text-base">
                    Shop Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg" className="text-base border-white/30 text-white hover:bg-white/10">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-strong">
                  <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" alt="Shopping" fill className="object-cover" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-strong">
                  <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop" alt="Products" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-strong">
                  <Image src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop" alt="Store" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-strong">
                  <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop" alt="Fashion" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-text-primary">{feature.title}</h3>
                  <p className="text-xs text-text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">Shop by Category</h2>
              <p className="text-text-secondary mt-1">Browse our curated collections</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`} className="group relative aspect-square rounded-2xl overflow-hidden">
                <Image src={category.image_url || ""} alt={category.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                  <p className="text-white/70 text-sm mt-0.5">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.featured.length > 0 && (
        <section className="py-12 md:py-16 bg-surface-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">Featured Products</h2>
                <p className="text-text-secondary mt-1">Our top picks just for you</p>
              </div>
              <Link href="/products?featured=true" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:underline">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={products.featured} />
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">New Arrivals</h2>
              <p className="text-text-secondary mt-1">Check out our latest products</p>
            </div>
            <Link href="/products?sort=newest" className="hidden sm:flex items-center gap-1 text-primary-500 font-medium hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={products.all} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-400 to-primary-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Get 20% Off Your First Order</h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">Subscribe to our newsletter and receive exclusive offers.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 transition-colors" />
            <Button variant="secondary" size="lg" className="min-w-[120px]">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
