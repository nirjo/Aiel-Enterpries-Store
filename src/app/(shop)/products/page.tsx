import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import type { Product, Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Products — Aiel Enterprises",
  description: "Browse our collection of home, kitchen, decor, garden, gift, electronics & sports products",
};

// Price range definitions
const PRICE_RANGES = [
  { label: "Under ₹500", slug: "0-500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", slug: "500-1000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", slug: "1000-2000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", slug: "2000-5000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", slug: "5000-up", min: 5000, max: Infinity },
];

const categorySlugToId: Record<string, string> = {
  "sensory-toys": "1",
  "montessori-toys": "2",
  "educational-toys": "3",
  "stem-toys": "4",
  "action-figures": "5",
  "musical-toys": "6",
  "board-card-games": "7",
  "wooden-toys": "8",
  "home-kitchen": "9",
  "home-decor": "10",
  "gardening": "11",
  "electronics": "12",
  "stationery-items": "13",
  "sport-exercise": "14",
  "gift-items": "15",
};

const fallbackProducts: Product[] = [
  {
    id: "1", name: "Pop-It Fidget Board", slug: "pop-it-fidget-board",
    description: "", short_description: "Rainbow silicone sensory toy", price: 299, compare_at_price: 499,
    cost_price: null, sku: "SNS-001", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
    is_active: true, is_featured: true, tags: ["sensory-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Montessori Stacking Tower", slug: "montessori-stacking-tower",
    description: "", short_description: "Wooden rainbow stacking blocks", price: 1299, compare_at_price: 1799,
    cost_price: null, sku: "MON-001", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
    is_active: true, is_featured: true, tags: ["montessori-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "Magnetic Building Tiles 120pc", slug: "magnetic-building-tiles-120",
    description: "", short_description: "Colourful 3D magnetic construction set", price: 2199, compare_at_price: 2999,
    cost_price: null, sku: "EDU-001", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600",
    is_active: true, is_featured: true, tags: ["educational-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Robotics Starter Kit Pro", slug: "robotics-starter-kit-pro",
    description: "", short_description: "Build & program your first robot", price: 4999, compare_at_price: 6999,
    cost_price: null, sku: "STM-001", barcode: null, category_id: "4",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    is_active: true, is_featured: true, tags: ["stem-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "5", name: "Smart Kitchen Organizer", slug: "smart-kitchen-organizer",
    description: "", short_description: "Multi-tier rotating storage rack", price: 1599, compare_at_price: 2199,
    cost_price: null, sku: "HMK-001", barcode: null, category_id: "9",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    is_active: true, is_featured: true, tags: ["home-kitchen"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "6", name: "Boho Wall Art Set", slug: "boho-wall-art-set",
    description: "", short_description: "3-piece modern boho canvas prints", price: 1999, compare_at_price: 2799,
    cost_price: null, sku: "HDC-001", barcode: null, category_id: "10",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    is_active: true, is_featured: true, tags: ["home-decor"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "7", name: "Garden Tool Set Premium", slug: "garden-tool-set-premium",
    description: "", short_description: "12-piece stainless steel garden kit", price: 2299, compare_at_price: 3199,
    cost_price: null, sku: "GRD-001", barcode: null, category_id: "11",
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    is_active: true, is_featured: true, tags: ["gardening"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "8", name: "Bluetooth Speaker Pro", slug: "bluetooth-speaker-pro",
    description: "", short_description: "Portable waterproof 20W speaker", price: 3499, compare_at_price: 4999,
    cost_price: null, sku: "ELC-001", barcode: null, category_id: "12",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    is_active: true, is_featured: true, tags: ["electronics"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "9", name: "Premium Notebook Set", slug: "premium-notebook-set",
    description: "", short_description: "A5 leather-bound journals, set of 3", price: 899, compare_at_price: 1299,
    cost_price: null, sku: "STN-001", barcode: null, category_id: "13",
    images: ["https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600",
    is_active: true, is_featured: true, tags: ["stationery-items"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "10", name: "Yoga Mat Premium", slug: "yoga-mat-premium",
    description: "", short_description: "Non-slip 6mm eco-friendly mat", price: 1299, compare_at_price: 1899,
    cost_price: null, sku: "SPT-001", barcode: null, category_id: "14",
    images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
    is_active: true, is_featured: true, tags: ["sport-exercise"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "11", name: "Gift Hamper Deluxe", slug: "gift-hamper-deluxe",
    description: "", short_description: "Premium curated gift basket", price: 2999, compare_at_price: 4499,
    cost_price: null, sku: "GFT-001", barcode: null, category_id: "15",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
    is_active: true, is_featured: true, tags: ["gift-items"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "12", name: "Wireless Earbuds Elite", slug: "wireless-earbuds-elite",
    description: "", short_description: "ANC earbuds with 30hr battery", price: 4999, compare_at_price: 6999,
    cost_price: null, sku: "ELC-002", barcode: null, category_id: "12",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    is_active: true, is_featured: true, tags: ["electronics"], metadata: {}, created_at: "", updated_at: "",
  },
];

const fallbackCategories: Category[] = [
  { id: "1", name: "Sensory Toys", slug: "sensory-toys", description: "Stimulating fidget & sensory toys", image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Montessori Toys", slug: "montessori-toys", description: "Hands-on learning for little ones", image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Educational Toys", slug: "educational-toys", description: "Fun learning through play", image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "STEM Toys", slug: "stem-toys", description: "Science, tech & engineering kits", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Action Figures", slug: "action-figures", description: "Superheroes, anime & collectibles", image_url: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Musical Toys", slug: "musical-toys", description: "Kid-friendly musical instruments", image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Board & Card Games", slug: "board-card-games", description: "Family game night essentials", image_url: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400&h=400&fit=crop", parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Wooden Toys", slug: "wooden-toys", description: "Classic handcrafted wooden toys", image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop", parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Home & Kitchen", slug: "home-kitchen", description: "Smart kitchen & home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", name: "Home Decor", slug: "home-decor", description: "Stylish decor for every room", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", parent_id: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", name: "Gardening", slug: "gardening", description: "Tools, planters & garden decor", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", parent_id: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", name: "Electronics", slug: "electronics", description: "Gadgets, speakers & accessories", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", parent_id: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
  { id: "13", name: "Stationery Items", slug: "stationery-items", description: "Notebooks, pens & art supplies", image_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop", parent_id: null, sort_order: 13, is_active: true, created_at: "", updated_at: "" },
  { id: "14", name: "Sport & Exercise", slug: "sport-exercise", description: "Fitness gear & outdoor sports", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", parent_id: null, sort_order: 14, is_active: true, created_at: "", updated_at: "" },
  { id: "15", name: "Gift Items", slug: "gift-items", description: "Curated gifts for every occasion", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop", parent_id: null, sort_order: 15, is_active: true, created_at: "", updated_at: "" },
];

function getSubcategoriesForCategory(categorySlug: string) {
  const navLink = NAV_LINKS.find(
    (link: NavLink) => link.href.includes(`category=${categorySlug}`) && link.subcategories
  );
  return navLink?.subcategories || [];
}

function buildFilterUrl(
  currentParams: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
): string {
  const merged: Record<string, string> = {};
  for (const [key, val] of Object.entries(currentParams)) {
    if (val !== undefined) merged[key] = val;
  }
  for (const [key, val] of Object.entries(updates)) {
    if (val === undefined) {
      delete merged[key];
    } else {
      merged[key] = val;
    }
  }
  const qs = new URLSearchParams(merged).toString();
  return `/products${qs ? `?${qs}` : ""}`;
}

function parsePriceRange(slug: string): { min: number; max: number } | null {
  const range = PRICE_RANGES.find((r) => r.slug === slug);
  return range ? { min: range.min, max: range.max } : null;
}

type SearchParams = {
  category?: string;
  featured?: string;
  search?: string;
  sub?: string;
  price?: string;
  sort?: string;
};

async function getProducts(searchParams: SearchParams): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").eq("is_active", true);

    if (searchParams.sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (searchParams.sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.limit(24);

    if (searchParams.category) {
      const { data: category } = await supabase
        .from("categories").select("id").eq("slug", searchParams.category).single() as { data: { id: string } | null };
      if (category) query = query.eq("category_id", category.id);
    }
    if (searchParams.featured === "true") query = query.eq("is_featured", true);
    if (searchParams.search) query = query.ilike("name", `%${searchParams.search}%`);
    if (searchParams.sub) query = query.contains("tags", [searchParams.sub]);

    const priceRange = searchParams.price ? parsePriceRange(searchParams.price) : null;
    if (priceRange) {
      query = query.gte("price", priceRange.min);
      if (priceRange.max !== Infinity) query = query.lte("price", priceRange.max);
    }

    const { data, error } = await query as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) return filterFallbackProducts(searchParams);
    return data;
  } catch {
    return filterFallbackProducts(searchParams);
  }
}

function filterFallbackProducts(searchParams: SearchParams): Product[] {
  let filtered = [...fallbackProducts];
  if (searchParams.category) {
    const catId = categorySlugToId[searchParams.category];
    if (catId) filtered = filtered.filter((p) => p.category_id === catId);
  }
  if (searchParams.sub) filtered = filtered.filter((p) => p.tags?.includes(searchParams.sub!));
  if (searchParams.search) {
    const term = searchParams.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
  }
  if (searchParams.featured === "true") filtered = filtered.filter((p) => p.is_featured);
  const priceRange = searchParams.price ? parsePriceRange(searchParams.price) : null;
  if (priceRange) filtered = filtered.filter((p) => p.price >= priceRange.min && (priceRange.max === Infinity || p.price <= priceRange.max));
  if (searchParams.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (searchParams.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  return filtered;
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true }) as { data: Category[] | null; error: unknown };
    if (error || !data || data.length === 0) return fallbackCategories;
    return data;
  } catch {
    return fallbackCategories;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(params), getCategories()]);
  const subcategories = params.category ? getSubcategoriesForCategory(params.category) : [];

  const getPageTitle = () => {
    if (params.search) return `Search: "${params.search}"`;
    if (params.sub) return subcategories.find((s) => s.slug === params.sub)?.label || "Products";
    if (params.category) return categories.find((c) => c.slug === params.category)?.name || "Products";
    return "All Products";
  };

  const hasActiveFilters = !!(params.price || params.featured || params.sub);
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
  ];
  const currentSort = params.sort || "newest";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">Home</Link></li>
              <li className="text-text-muted">/</li>
              {params.category ? (
                <>
                  <li><Link href="/products" className="text-text-muted hover:text-primary-500 transition-colors">Products</Link></li>
                  <li className="text-text-muted">/</li>
                  <li className={params.sub ? "text-text-muted" : "text-text-primary font-medium"}>
                    {params.sub ? (
                      <Link href={buildFilterUrl(params, { sub: undefined })} className="hover:text-primary-500 transition-colors">
                        {categories.find((c) => c.slug === params.category)?.name || params.category}
                      </Link>
                    ) : (categories.find((c) => c.slug === params.category)?.name || params.category)}
                  </li>
                  {params.sub && (<><li className="text-text-muted">/</li><li className="text-text-primary font-medium">{subcategories.find((s) => s.slug === params.sub)?.label || params.sub}</li></>)}
                </>
              ) : (<li className="text-text-primary font-medium">Products</li>)}
            </ol>
          </nav>
        </div>
      </div>

      {/* Subcategory bar */}
      {subcategories.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Link href={buildFilterUrl(params, { sub: undefined })} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all ${!params.sub ? "bg-primary-500 text-white border-primary-500" : "bg-white text-text-secondary border-gray-200 hover:border-primary-400 hover:text-primary-500"}`}>All</Link>
              {subcategories.map((sub) => (
                <Link key={sub.slug} href={buildFilterUrl(params, { sub: sub.slug })} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${params.sub === sub.slug ? "bg-primary-500 text-white border-primary-500" : "bg-white text-text-secondary border-gray-200 hover:border-primary-400 hover:text-primary-500"}`}>
                  <div className="relative w-5 h-5 rounded-full overflow-hidden"><Image src={sub.image} alt={sub.label} fill className="object-cover" sizes="20px" /></div>
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-text-primary tracking-wide">Filters</h2>
                {hasActiveFilters && (
                  <Link href={buildFilterUrl(params, { price: undefined, featured: undefined, sub: undefined })} className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"><X className="h-3 w-3" />Clear All</Link>
                )}
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Category</h3>
                <div className="space-y-1.5">
                  <Link href={buildFilterUrl(params, { category: undefined, sub: undefined })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${!params.category ? "text-primary-500 font-medium bg-primary-50" : "text-text-secondary hover:text-text-primary hover:bg-gray-50"}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!params.category ? "bg-primary-500" : "bg-gray-300"}`} />All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={buildFilterUrl(params, { category: cat.slug, sub: undefined })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${params.category === cat.slug ? "text-primary-500 font-medium bg-primary-50" : "text-text-secondary hover:text-text-primary hover:bg-gray-50"}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${params.category === cat.slug ? "bg-primary-500" : "bg-gray-300"}`} />{cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Price Range</h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => {
                    const isActive = params.price === range.slug;
                    return (
                      <Link key={range.slug} href={buildFilterUrl(params, { price: isActive ? undefined : range.slug })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${isActive ? "text-primary-500 font-medium bg-primary-50" : "text-text-secondary hover:text-text-primary hover:bg-gray-50"}`}>
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isActive ? "border-primary-500 bg-primary-500" : "border-gray-300"}`}>
                          {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>{range.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Featured filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Other</h3>
                <Link href={buildFilterUrl(params, { featured: params.featured === "true" ? undefined : "true" })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${params.featured === "true" ? "text-primary-500 font-medium bg-primary-50" : "text-text-secondary hover:text-text-primary hover:bg-gray-50"}`}>
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${params.featured === "true" ? "border-primary-500 bg-primary-500" : "border-gray-300"}`}>
                    {params.featured === "true" && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>Featured Only
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-text-primary tracking-wide">{getPageTitle()}</h1>
                <p className="text-sm text-text-muted mt-1">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                  {params.price && <span className="ml-1">· {PRICE_RANGES.find((r) => r.slug === params.price)?.label}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Sort:</span>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors bg-white text-text-primary">
                    {sortOptions.find((o) => o.value === currentSort)?.label || "Newest"}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-strong opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
                    {sortOptions.map((option) => (
                      <Link key={option.value} href={buildFilterUrl(params, { sort: option.value })} className={`block px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${currentSort === option.value ? "text-primary-500 font-medium bg-primary-50" : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"}`}>{option.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {params.price && (<Link href={buildFilterUrl(params, { price: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-500 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors">{PRICE_RANGES.find((r) => r.slug === params.price)?.label}<X className="h-3 w-3" /></Link>)}
                {params.featured === "true" && (<Link href={buildFilterUrl(params, { featured: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-500 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors">Featured Only<X className="h-3 w-3" /></Link>)}
                {params.sub && (<Link href={buildFilterUrl(params, { sub: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-500 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors">{subcategories.find((s) => s.slug === params.sub)?.label || params.sub}<X className="h-3 w-3" /></Link>)}
              </div>
            )}

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <SlidersHorizontal className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-display font-semibold text-text-primary mb-2">No products found</h3>
                <p className="text-sm text-text-muted mb-4">Try adjusting your filters or browse a different category.</p>
                <Link href="/products"><Button>View All Products</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
