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
  title: "Products — Anti-Gravity Toys",
  description: "Browse our collection of levitation toys, gyroscopes, STEM kits & magnetic gadgets",
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
  "levitation-toys": "1",
  "gyroscopes": "2",
  "stem-kits": "3",
  "magnetic-gadgets": "4",
  "space-gravity": "5",
};

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
  {
    id: "9", name: "Newton's Cradle Deluxe", slug: "newtons-cradle-deluxe",
    description: "", short_description: "Large polished steel cradle", price: 799, compare_at_price: 1199,
    cost_price: null, sku: "SPC-002", barcode: null, category_id: "5",
    images: ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
    is_active: true, is_featured: false, tags: ["newtons-cradle"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "10", name: "Magnetic Building Tiles Set", slug: "magnetic-building-tiles",
    description: "", short_description: "120-piece 3D magnetic tiles", price: 2199, compare_at_price: 2999,
    cost_price: null, sku: "MAG-002", barcode: null, category_id: "4",
    images: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600",
    is_active: true, is_featured: true, tags: ["mag-tiles"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "11", name: "Plasma Ball Globe", slug: "plasma-ball-globe",
    description: "", short_description: "Touch-reactive electric globe", price: 1599, compare_at_price: null,
    cost_price: null, sku: "SPC-003", barcode: null, category_id: "5",
    images: ["https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=600",
    is_active: true, is_featured: false, tags: ["plasma-balls"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "12", name: "Magnet Science Lab Kit", slug: "magnet-science-lab-kit",
    description: "", short_description: "25+ magnet experiments", price: 1899, compare_at_price: 2499,
    cost_price: null, sku: "STM-003", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600",
    is_active: true, is_featured: false, tags: ["magnet-kits"], metadata: {}, created_at: "", updated_at: "",
  },
];

const fallbackCategories: Category[] = [
  { id: "1", name: "Levitation Toys", slug: "levitation-toys", description: "", image_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Gyroscopes & Spinners", slug: "gyroscopes", description: "", image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "STEM Kits", slug: "stem-kits", description: "", image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Magnetic Gadgets", slug: "magnetic-gadgets", description: "", image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Space & Gravity", slug: "space-gravity", description: "", image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
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
    <div className="min-h-screen bg-[#050510]">
      {/* Breadcrumb */}
      <div className="bg-[#0A0A2E] py-4 border-b border-white/5">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="text-text-muted hover:text-accent-400 transition-colors">Home</Link></li>
              <li className="text-text-muted">/</li>
              {params.category ? (
                <>
                  <li><Link href="/products" className="text-text-muted hover:text-accent-400 transition-colors">Products</Link></li>
                  <li className="text-text-muted">/</li>
                  <li className={params.sub ? "text-text-muted" : "text-white font-medium"}>
                    {params.sub ? (
                      <Link href={buildFilterUrl(params, { sub: undefined })} className="hover:text-accent-400 transition-colors">
                        {categories.find((c) => c.slug === params.category)?.name || params.category}
                      </Link>
                    ) : (categories.find((c) => c.slug === params.category)?.name || params.category)}
                  </li>
                  {params.sub && (<><li className="text-text-muted">/</li><li className="text-white font-medium">{subcategories.find((s) => s.slug === params.sub)?.label || params.sub}</li></>)}
                </>
              ) : (<li className="text-white font-medium">Products</li>)}
            </ol>
          </nav>
        </div>
      </div>

      {/* Subcategory bar */}
      {subcategories.length > 0 && (
        <div className="bg-[#0D0D22] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Link href={buildFilterUrl(params, { sub: undefined })} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all ${!params.sub ? "bg-accent-400 text-[#050510] border-accent-400" : "bg-white/5 text-text-secondary border-white/10 hover:border-accent-400/40 hover:text-accent-400"}`}>All</Link>
              {subcategories.map((sub) => (
                <Link key={sub.slug} href={buildFilterUrl(params, { sub: sub.slug })} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${params.sub === sub.slug ? "bg-accent-400 text-[#050510] border-accent-400" : "bg-white/5 text-text-secondary border-white/10 hover:border-accent-400/40 hover:text-accent-400"}`}>
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
                <h2 className="font-display font-semibold text-lg text-white tracking-wide">Filters</h2>
                {hasActiveFilters && (
                  <Link href={buildFilterUrl(params, { price: undefined, featured: undefined, sub: undefined })} className="text-xs font-medium text-accent-400 hover:text-accent-300 transition-colors flex items-center gap-1"><X className="h-3 w-3" />Clear All</Link>
                )}
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-white mb-3">Category</h3>
                <div className="space-y-1.5">
                  <Link href={buildFilterUrl(params, { category: undefined, sub: undefined })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${!params.category ? "text-accent-400 font-medium bg-accent-400/10" : "text-text-secondary hover:text-white hover:bg-white/5"}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!params.category ? "bg-accent-400" : "bg-white/20"}`} />All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={buildFilterUrl(params, { category: cat.slug, sub: undefined })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${params.category === cat.slug ? "text-accent-400 font-medium bg-accent-400/10" : "text-text-secondary hover:text-white hover:bg-white/5"}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${params.category === cat.slug ? "bg-accent-400" : "bg-white/20"}`} />{cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-white mb-3">Price Range</h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range) => {
                    const isActive = params.price === range.slug;
                    return (
                      <Link key={range.slug} href={buildFilterUrl(params, { price: isActive ? undefined : range.slug })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${isActive ? "text-accent-400 font-medium bg-accent-400/10" : "text-text-secondary hover:text-white hover:bg-white/5"}`}>
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isActive ? "border-accent-400 bg-accent-400" : "border-white/20"}`}>
                          {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#050510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>{range.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Featured filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-white mb-3">Other</h3>
                <Link href={buildFilterUrl(params, { featured: params.featured === "true" ? undefined : "true" })} className={`flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-lg transition-colors ${params.featured === "true" ? "text-accent-400 font-medium bg-accent-400/10" : "text-text-secondary hover:text-white hover:bg-white/5"}`}>
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${params.featured === "true" ? "border-accent-400 bg-accent-400" : "border-white/20"}`}>
                    {params.featured === "true" && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#050510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>Featured Only
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-white tracking-wide">{getPageTitle()}</h1>
                <p className="text-sm text-text-muted mt-1">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                  {params.price && <span className="ml-1">· {PRICE_RANGES.find((r) => r.slug === params.price)?.label}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Sort:</span>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 transition-colors bg-white/5 text-white">
                    {sortOptions.find((o) => o.value === currentSort)?.label || "Newest"}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-[#1A1A3E] border border-white/10 rounded-lg shadow-strong opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
                    {sortOptions.map((option) => (
                      <Link key={option.value} href={buildFilterUrl(params, { sort: option.value })} className={`block px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${currentSort === option.value ? "text-accent-400 font-medium bg-accent-400/10" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>{option.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {params.price && (<Link href={buildFilterUrl(params, { price: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-400/10 text-accent-400 text-xs font-medium border border-accent-400/20 hover:bg-accent-400/20 transition-colors">{PRICE_RANGES.find((r) => r.slug === params.price)?.label}<X className="h-3 w-3" /></Link>)}
                {params.featured === "true" && (<Link href={buildFilterUrl(params, { featured: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-400/10 text-accent-400 text-xs font-medium border border-accent-400/20 hover:bg-accent-400/20 transition-colors">Featured Only<X className="h-3 w-3" /></Link>)}
                {params.sub && (<Link href={buildFilterUrl(params, { sub: undefined })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-400/10 text-accent-400 text-xs font-medium border border-accent-400/20 hover:bg-accent-400/20 transition-colors">{subcategories.find((s) => s.slug === params.sub)?.label || params.sub}<X className="h-3 w-3" /></Link>)}
              </div>
            )}

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <SlidersHorizontal className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2">No products found</h3>
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
