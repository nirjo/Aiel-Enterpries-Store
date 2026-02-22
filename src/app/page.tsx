import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Rocket, Headphones } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ProductGrid } from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/database";

const features = [
  { icon: Rocket, title: "Free Shipping", description: "On orders over ₹999" },
  { icon: Shield, title: "Quality Assured", description: "Trusted products" },
  { icon: Zap, title: "Easy Returns", description: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", description: "Expert guidance" },
];

const fallbackCategories: Category[] = [
  { id: "1", name: "Sensory Toys", slug: "sensory-toys", description: "Fidget spinners, pop-its & tactile play", image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Montessori Toys", slug: "montessori-toys", description: "Wooden puzzles & learning materials", image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Educational Toys", slug: "educational-toys", description: "Interactive learning & discovery", image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "STEM Toys", slug: "stem-toys", description: "Robotics, coding & science kits", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Action Figures", slug: "action-figures", description: "Superheroes, vehicles & collectibles", image_url: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Musical Toys", slug: "musical-toys", description: "Instruments & music makers for kids", image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Board & Card Games", slug: "board-card-games", description: "Family strategy & party games", image_url: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=400&fit=crop", parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Wooden Toys", slug: "wooden-toys", description: "Classic handcrafted wooden play", image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop", parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Home & Kitchen", slug: "home-kitchen", description: "Smart kitchen & home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", name: "Home Decor", slug: "home-decor", description: "Stylish decor for every room", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", parent_id: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", name: "Gardening", slug: "gardening", description: "Tools, planters & garden decor", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", parent_id: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", name: "Electronics", slug: "electronics", description: "Gadgets, speakers & accessories", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", parent_id: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
  { id: "13", name: "Stationery Items", slug: "stationery-items", description: "Notebooks, pens & art supplies", image_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop", parent_id: null, sort_order: 13, is_active: true, created_at: "", updated_at: "" },
  { id: "14", name: "Sport & Exercise", slug: "sport-exercise", description: "Fitness gear & outdoor sports", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", parent_id: null, sort_order: 14, is_active: true, created_at: "", updated_at: "" },
  { id: "15", name: "Gift Items", slug: "gift-items", description: "Curated gifts for every occasion", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop", parent_id: null, sort_order: 15, is_active: true, created_at: "", updated_at: "" },
];

const fallbackProducts: Product[] = [
  { id: "1", name: "Pop-It Fidget Board", slug: "pop-it-fidget-board", description: "", short_description: "Rainbow silicone sensory toy", price: 299, compare_at_price: 499, cost_price: null, sku: "SNS-001", barcode: null, category_id: "1", images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600", is_active: true, is_featured: true, tags: ["sensory-toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "2", name: "Montessori Stacking Tower", slug: "montessori-stacking-tower", description: "", short_description: "Wooden rainbow stacking blocks", price: 1299, compare_at_price: 1799, cost_price: null, sku: "MON-001", barcode: null, category_id: "2", images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600", is_active: true, is_featured: true, tags: ["montessori-toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "3", name: "Magnetic Building Tiles 120pc", slug: "magnetic-building-tiles-120", description: "", short_description: "Colourful 3D magnetic construction set", price: 2199, compare_at_price: 2999, cost_price: null, sku: "EDU-001", barcode: null, category_id: "3", images: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600", is_active: true, is_featured: true, tags: ["educational-toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "4", name: "Robotics Starter Kit Pro", slug: "robotics-starter-kit-pro", description: "", short_description: "Build & program your first robot", price: 4999, compare_at_price: 6999, cost_price: null, sku: "STM-001", barcode: null, category_id: "4", images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600", is_active: true, is_featured: true, tags: ["stem-toys"], metadata: {}, created_at: "", updated_at: "" },
  { id: "5", name: "Smart Kitchen Organizer", slug: "smart-kitchen-organizer", description: "", short_description: "Multi-tier rotating storage rack", price: 1599, compare_at_price: 2199, cost_price: null, sku: "HMK-001", barcode: null, category_id: "9", images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", is_active: true, is_featured: true, tags: ["home-kitchen"], metadata: {}, created_at: "", updated_at: "" },
  { id: "6", name: "Bluetooth Speaker Pro", slug: "bluetooth-speaker-pro", description: "", short_description: "Portable waterproof 20W speaker", price: 3499, compare_at_price: 4999, cost_price: null, sku: "ELC-001", barcode: null, category_id: "12", images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600", is_active: true, is_featured: true, tags: ["electronics"], metadata: {}, created_at: "", updated_at: "" },
  { id: "7", name: "Premium Notebook Set", slug: "premium-notebook-set", description: "", short_description: "A5 leather-bound journals, set of 3", price: 899, compare_at_price: 1299, cost_price: null, sku: "STN-001", barcode: null, category_id: "13", images: ["https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600", is_active: true, is_featured: true, tags: ["stationery-items"], metadata: {}, created_at: "", updated_at: "" },
  { id: "8", name: "Yoga Mat Premium", slug: "yoga-mat-premium", description: "", short_description: "Non-slip 6mm eco-friendly mat", price: 1299, compare_at_price: 1899, cost_price: null, sku: "SPT-001", barcode: null, category_id: "14", images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"], thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600", is_active: true, is_featured: true, tags: ["sport-exercise"], metadata: {}, created_at: "", updated_at: "" },
];

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }).limit(15) as { data: Category[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackCategories;
    return data;
  } catch { return fallbackCategories; }
}

async function getProducts(): Promise<{ featured: Product[]; all: Product[] }> {
  try {
    const supabase = await createClient();
    const { data: allProducts, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(8) as { data: Product[] | null; error: unknown };
    if (error || !allProducts || allProducts.length === 0) {
      return { featured: fallbackProducts.filter((p) => p.is_featured), all: fallbackProducts };
    }
    return { featured: allProducts.filter((p) => p.is_featured), all: allProducts };
  } catch {
    return { featured: fallbackProducts.filter((p) => p.is_featured), all: fallbackProducts };
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <HeroCarousel />

      {/* Features bar */}
      <section className="py-6 border-b border-primary-500/10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 border border-primary-200/50">
                  <feature.icon className="h-5 w-5 text-primary-500" />
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
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-wide">Shop by Category</h2>
              <p className="text-text-secondary mt-1">Browse our curated collections</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-secondary-500 font-medium hover:text-secondary-600 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category, index) => {
              const overlays = [
                "bg-gradient-to-r from-[#411dd3]/90 to-[#1dd39c]/80",
                "bg-gradient-to-br from-[#1dd39c]/90 to-[#afd31d]/80",
                "bg-gradient-to-t from-[#d31d54]/90 to-[#411dd3]/80",
                "bg-gradient-to-r from-[#afd31d]/90 to-[#d31d54]/80",
                "bg-gradient-to-bl from-[#411dd3]/85 to-[#1dd39c]/75",
                "bg-gradient-to-tr from-[#d31d54]/85 to-[#afd31d]/80",
              ];
              const shadows = [
                "hover:shadow-[0_10px_40px_rgba(65,29,211,0.25)]",
                "hover:shadow-[0_10px_40px_rgba(29,211,156,0.25)]",
                "hover:shadow-[0_10px_40px_rgba(211,29,84,0.25)]",
                "hover:shadow-[0_10px_40px_rgba(175,211,29,0.25)]",
                "hover:shadow-[0_10px_40px_rgba(65,29,211,0.2)]",
                "hover:shadow-[0_10px_40px_rgba(211,29,84,0.2)]",
              ];
              return (
                <Link key={category.id} href={`/products?category=${category.slug}`} className={`group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-sm ${shadows[index % 6]} hover:scale-[1.03] active:scale-[0.98] transition-all duration-300`}>
                  <Image src={category.image_url || ""} alt={category.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw" />
                  <div className={`absolute inset-0 ${overlays[index % 6]} mix-blend-multiply transition-opacity duration-300 group-hover:opacity-90`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display font-bold text-white text-sm md:text-base tracking-wide drop-shadow-md">{category.name}</h3>
                    <p className="text-white/80 text-xs mt-0.5 font-medium">Explore →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.featured.length > 0 && (
        <section className="py-14 md:py-20 bg-gradient-to-br from-primary-50/60 to-secondary-50/40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-wide">Featured Products</h2>
                <p className="text-text-secondary mt-1">Our most popular picks</p>
              </div>
              <Link href="/products?featured=true" className="hidden sm:flex items-center gap-1 text-secondary-500 font-medium hover:text-secondary-600 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ProductGrid products={products.featured} />
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-wide">New Arrivals</h2>
              <p className="text-text-secondary mt-1">Latest additions to our store</p>
            </div>
            <Link href="/products?sort=newest" className="hidden sm:flex items-center gap-1 text-secondary-500 font-medium hover:text-secondary-600 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={products.all} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-lime-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-wide">Welcome to Aiel Enterprises 🎉</h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">Get 20% off your first order. Join our family of happy shoppers!</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/15 focus:border-secondary-400/50 transition-colors backdrop-blur-sm" />
            <Button variant="secondary" size="lg" className="min-w-[120px]">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
