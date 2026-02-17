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
  title: "Products",
  description: "Browse our collection of premium products",
};

// Price range definitions
const PRICE_RANGES = [
  { label: "Under ₹500", slug: "0-500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", slug: "500-1000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", slug: "1000-2000", min: 1000, max: 2000 },
  { label: "₹2,000 - ₹5,000", slug: "2000-5000", min: 2000, max: 5000 },
  { label: "Above ₹5,000", slug: "5000-up", min: 5000, max: Infinity },
];

// Map category slugs to fallback IDs for fallback filtering
const categorySlugToId: Record<string, string> = {
  "toy-paradise": "1",
  "home-decor": "2",
  "kitchen-items": "3",
  "gardening": "4",
  "gift-items": "5",
};

// Fallback products when database is empty
const fallbackProducts: Product[] = [
  {
    id: "1", name: "Rainbow Sensory Blocks", slug: "rainbow-sensory-blocks",
    description: "", short_description: "Colorful sensory play blocks", price: 1299, compare_at_price: 1799,
    cost_price: null, sku: "TOY-001", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
    is_active: true, is_featured: true, tags: ["sensory-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "2", name: "Montessori Wooden Puzzle Set", slug: "montessori-wooden-puzzle",
    description: "", short_description: "Educational wood puzzles", price: 899, compare_at_price: 1299,
    cost_price: null, sku: "TOY-002", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1615715616181-6ba85d724137?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1615715616181-6ba85d724137?w=600",
    is_active: true, is_featured: true, tags: ["montessori-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "3", name: "Abstract Canvas Wall Art", slug: "abstract-canvas-wall-art",
    description: "", short_description: "Modern abstract painting", price: 2499, compare_at_price: 3499,
    cost_price: null, sku: "HD-001", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600",
    is_active: true, is_featured: true, tags: ["wall-art"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "4", name: "Cast Iron Cookware Set", slug: "cast-iron-cookware-set",
    description: "", short_description: "5-piece cast iron set", price: 3999, compare_at_price: 5499,
    cost_price: null, sku: "KI-001", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    is_active: true, is_featured: false, tags: ["cookware"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "5", name: "Ceramic Planter Set", slug: "ceramic-planter-set",
    description: "", short_description: "Set of 3 ceramic pots", price: 1599, compare_at_price: 2199,
    cost_price: null, sku: "GD-001", barcode: null, category_id: "4",
    images: ["https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600",
    is_active: true, is_featured: true, tags: ["pots-planters"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "6", name: "Premium Gift Hamper", slug: "premium-gift-hamper",
    description: "", short_description: "Luxury curated hamper", price: 4999, compare_at_price: 6999,
    cost_price: null, sku: "GI-001", barcode: null, category_id: "5",
    images: ["https://images.unsplash.com/photo-1543255006-d6395b6f1171?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?w=600",
    is_active: true, is_featured: true, tags: ["hampers"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "7", name: "Scented Soy Candle Set", slug: "scented-soy-candle-set",
    description: "", short_description: "Set of 4 aromatic candles", price: 799, compare_at_price: 1199,
    cost_price: null, sku: "HD-002", barcode: null, category_id: "2",
    images: ["https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600",
    is_active: true, is_featured: false, tags: ["candles-holders"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "8", name: "STEM Robot Building Kit", slug: "stem-robot-building-kit",
    description: "", short_description: "Build & program robots", price: 2999, compare_at_price: 3999,
    cost_price: null, sku: "TOY-003", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=600",
    is_active: true, is_featured: true, tags: ["stem-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "9", name: "Wooden Toy Train Set", slug: "wooden-toy-train-set",
    description: "", short_description: "Classic wooden train", price: 499, compare_at_price: 699,
    cost_price: null, sku: "TOY-004", barcode: null, category_id: "1",
    images: ["https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600",
    is_active: true, is_featured: false, tags: ["wooden-toys"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "10", name: "Garden Tool Set", slug: "garden-tool-set",
    description: "", short_description: "5-piece steel tool set", price: 1899, compare_at_price: 2499,
    cost_price: null, sku: "GD-002", barcode: null, category_id: "4",
    images: ["https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=600",
    is_active: true, is_featured: true, tags: ["garden-tools"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "11", name: "Personalized Photo Frame", slug: "personalized-photo-frame",
    description: "", short_description: "Custom engraved frame", price: 699, compare_at_price: null,
    cost_price: null, sku: "GI-002", barcode: null, category_id: "5",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600",
    is_active: true, is_featured: false, tags: ["personalized-gifts"], metadata: {}, created_at: "", updated_at: "",
  },
  {
    id: "12", name: "Bamboo Cutting Board Set", slug: "bamboo-cutting-board-set",
    description: "", short_description: "Set of 3 bamboo boards", price: 1299, compare_at_price: 1799,
    cost_price: null, sku: "KI-002", barcode: null, category_id: "3",
    images: ["https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600"],
    thumbnail_url: "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600",
    is_active: true, is_featured: false, tags: ["cutting-boards"], metadata: {}, created_at: "", updated_at: "",
  },
];

const fallbackCategories: Category[] = [
  { id: "1", name: "Toy Paradise", slug: "toy-paradise", description: "", image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Home Decor", slug: "home-decor", description: "", image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Kitchen Items", slug: "kitchen-items", description: "", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Gardening", slug: "gardening", description: "", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Gift Items", slug: "gift-items", description: "", image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
];

// Get subcategories for a given category slug from NAV_LINKS
function getSubcategoriesForCategory(categorySlug: string) {
  const navLink = NAV_LINKS.find(
    (link: NavLink) => link.href.includes(`category=${categorySlug}`) && link.subcategories
  );
  return navLink?.subcategories || [];
}

// Build a URL preserving existing params while toggling/setting new ones
function buildFilterUrl(
  currentParams: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
): string {
  const merged: Record<string, string> = {};

  // Copy current params
  for (const [key, val] of Object.entries(currentParams)) {
    if (val !== undefined) merged[key] = val;
  }

  // Apply updates (undefined = remove)
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

// Parse a price range slug into { min, max }
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
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    // Sort
    if (searchParams.sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (searchParams.sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (searchParams.sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.limit(24);

    if (searchParams.category) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", searchParams.category)
        .single() as { data: { id: string } | null };
      
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    if (searchParams.featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (searchParams.search) {
      query = query.ilike("name", `%${searchParams.search}%`);
    }

    if (searchParams.sub) {
      query = query.contains("tags", [searchParams.sub]);
    }

    // Price filter (server-side)
    const priceRange = searchParams.price ? parsePriceRange(searchParams.price) : null;
    if (priceRange) {
      query = query.gte("price", priceRange.min);
      if (priceRange.max !== Infinity) {
        query = query.lte("price", priceRange.max);
      }
    }

    const { data, error } = await query as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) {
      return filterFallbackProducts(searchParams);
    }
    return data;
  } catch {
    return filterFallbackProducts(searchParams);
  }
}

function filterFallbackProducts(searchParams: SearchParams): Product[] {
  let filtered = [...fallbackProducts];

  // Category filter
  if (searchParams.category) {
    const catId = categorySlugToId[searchParams.category];
    if (catId) {
      filtered = filtered.filter((p) => p.category_id === catId);
    }
  }

  // Subcategory filter
  if (searchParams.sub) {
    filtered = filtered.filter((p) => p.tags?.includes(searchParams.sub!));
  }

  // Search filter
  if (searchParams.search) {
    const term = searchParams.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
  }

  // Featured filter
  if (searchParams.featured === "true") {
    filtered = filtered.filter((p) => p.is_featured);
  }

  // Price filter
  const priceRange = searchParams.price ? parsePriceRange(searchParams.price) : null;
  if (priceRange) {
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && (priceRange.max === Infinity || p.price <= priceRange.max)
    );
  }

  // Sort
  if (searchParams.sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (searchParams.sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }) as { data: Category[] | null; error: unknown };

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }
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
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const subcategories = params.category
    ? getSubcategoriesForCategory(params.category)
    : [];

  const getPageTitle = () => {
    if (params.search) return `Search results for "${params.search}"`;
    if (params.sub) {
      const sub = subcategories.find((s) => s.slug === params.sub);
      return sub?.label || "Products";
    }
    if (params.category) {
      return categories.find((c) => c.slug === params.category)?.name || "Products";
    }
    return "All Products";
  };

  // Active filters summary for "clear all"
  const hasActiveFilters = !!(params.price || params.featured || params.sub);

  // Sort options
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];
  const currentSort = params.sort || "newest";

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface-100 py-4 border-b border-surface-300">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li className="text-text-muted">/</li>
              {params.category ? (
                <>
                  <li>
                    <Link href="/products" className="text-text-muted hover:text-primary-500 transition-colors">Products</Link>
                  </li>
                  <li className="text-text-muted">/</li>
                  <li className={params.sub ? "text-text-muted" : "text-text-primary font-medium"}>
                    {params.sub ? (
                      <Link href={buildFilterUrl(params, { sub: undefined })} className="hover:text-primary-500 transition-colors">
                        {categories.find((c) => c.slug === params.category)?.name || params.category}
                      </Link>
                    ) : (
                      categories.find((c) => c.slug === params.category)?.name || params.category
                    )}
                  </li>
                  {params.sub && (
                    <>
                      <li className="text-text-muted">/</li>
                      <li className="text-text-primary font-medium">
                        {subcategories.find((s) => s.slug === params.sub)?.label || params.sub}
                      </li>
                    </>
                  )}
                </>
              ) : (
                <li className="text-text-primary font-medium">Products</li>
              )}
            </ol>
          </nav>
        </div>
      </div>

      {/* Subcategory bar */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b border-surface-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Link
                href={buildFilterUrl(params, { sub: undefined })}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  !params.sub
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-surface-100 text-text-secondary border-surface-300 hover:border-primary-300 hover:text-primary-500"
                }`}
              >
                All
              </Link>
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={buildFilterUrl(params, { sub: sub.slug })}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    params.sub === sub.slug
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-surface-100 text-text-secondary border-surface-300 hover:border-primary-300 hover:text-primary-500"
                  }`}
                >
                  <div className="relative w-5 h-5 rounded-full overflow-hidden">
                    <Image src={sub.image} alt={sub.label} fill className="object-cover" sizes="20px" />
                  </div>
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-text-primary">Filters</h2>
                {hasActiveFilters && (
                  <Link
                    href={buildFilterUrl(params, { price: undefined, featured: undefined, sub: undefined })}
                    className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </Link>
                )}
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Category</h3>
                <div className="space-y-1.5">
                  <Link
                    href={buildFilterUrl(params, { category: undefined, sub: undefined })}
                    className={`flex items-center gap-2 text-sm py-1 px-2 rounded-lg transition-colors ${
                      !params.category
                        ? "text-primary-500 font-medium bg-primary-50"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${!params.category ? "bg-primary-500" : "bg-surface-300"}`} />
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={buildFilterUrl(params, { category: cat.slug, sub: undefined })}
                      className={`flex items-center gap-2 text-sm py-1 px-2 rounded-lg transition-colors ${
                        params.category === cat.slug
                          ? "text-primary-500 font-medium bg-primary-50"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${params.category === cat.slug ? "bg-primary-500" : "bg-surface-300"}`} />
                      {cat.name}
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
                      <Link
                        key={range.slug}
                        href={buildFilterUrl(params, {
                          price: isActive ? undefined : range.slug,
                        })}
                        className={`flex items-center gap-2 text-sm py-1 px-2 rounded-lg transition-colors ${
                          isActive
                            ? "text-primary-500 font-medium bg-primary-50"
                            : "text-text-secondary hover:text-text-primary hover:bg-surface-100"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isActive ? "border-primary-500 bg-primary-500" : "border-surface-400"
                        }`}>
                          {isActive && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        {range.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Featured filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Other</h3>
                <Link
                  href={buildFilterUrl(params, {
                    featured: params.featured === "true" ? undefined : "true",
                  })}
                  className={`flex items-center gap-2 text-sm py-1 px-2 rounded-lg transition-colors ${
                    params.featured === "true"
                      ? "text-primary-500 font-medium bg-primary-50"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-100"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    params.featured === "true" ? "border-primary-500 bg-primary-500" : "border-surface-400"
                  }`}>
                    {params.featured === "true" && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  Featured Only
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-text-primary">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-text-muted mt-1">
                  Showing {products.length} product{products.length !== 1 ? "s" : ""}
                  {params.price && (
                    <span className="ml-1">
                      · {PRICE_RANGES.find((r) => r.slug === params.price)?.label}
                    </span>
                  )}
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Sort by:</span>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-400 text-sm hover:bg-surface-100 transition-colors bg-white">
                    {sortOptions.find((o) => o.value === currentSort)?.label || "Newest"}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-white border border-surface-300 rounded-lg shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[180px]">
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={buildFilterUrl(params, { sort: option.value })}
                        className={`block px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          currentSort === option.value
                            ? "text-primary-500 font-medium bg-primary-50"
                            : "text-text-secondary hover:bg-surface-100 hover:text-text-primary"
                        }`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {params.price && (
                  <Link
                    href={buildFilterUrl(params, { price: undefined })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    {PRICE_RANGES.find((r) => r.slug === params.price)?.label}
                    <X className="h-3 w-3" />
                  </Link>
                )}
                {params.featured === "true" && (
                  <Link
                    href={buildFilterUrl(params, { featured: undefined })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    Featured Only
                    <X className="h-3 w-3" />
                  </Link>
                )}
                {params.sub && (
                  <Link
                    href={buildFilterUrl(params, { sub: undefined })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    {subcategories.find((s) => s.slug === params.sub)?.label || params.sub}
                    <X className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}

            {/* Products grid */}
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-100 flex items-center justify-center">
                  <SlidersHorizontal className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No products found</h3>
                <p className="text-sm text-text-muted mb-4">Try adjusting your filters or browse a different category.</p>
                <Link href="/products">
                  <Button>View All Products</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
