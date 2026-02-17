import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
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

async function getProducts(searchParams: { category?: string; featured?: string; search?: string; sub?: string }): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (searchParams.category) {
      // Get category ID from slug
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

    // Filter by subcategory tag
    if (searchParams.sub) {
      query = query.contains("tags", [searchParams.sub]);
    }

    const { data, error } = await query as { data: Product[] | null; error: unknown };
    if (error || !data || data.length === 0) {
      // Filter fallback products
      let filtered = fallbackProducts;
      if (searchParams.search) {
        const term = searchParams.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
      }
      if (searchParams.sub) {
        filtered = filtered.filter(p => p.tags?.includes(searchParams.sub!));
      }
      return filtered;
    }
    return data;
  } catch {
    return fallbackProducts;
  }
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
  searchParams: Promise<{ category?: string; featured?: string; search?: string; sub?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  const subcategories = params.category
    ? getSubcategoriesForCategory(params.category)
    : [];

  // Determine current page title
  const getPageTitle = () => {
    if (params.search) return `Search results for "${params.search}"`;
    if (params.sub) {
      const sub = subcategories.find(s => s.slug === params.sub);
      return sub?.label || "Products";
    }
    if (params.category) {
      return categories.find(c => c.slug === params.category)?.name || "Products";
    }
    return "All Products";
  };

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
                      <Link href={`/products?category=${params.category}`} className="hover:text-primary-500 transition-colors">
                        {categories.find(c => c.slug === params.category)?.name || params.category}
                      </Link>
                    ) : (
                      categories.find(c => c.slug === params.category)?.name || params.category
                    )}
                  </li>
                  {params.sub && (
                    <>
                      <li className="text-text-muted">/</li>
                      <li className="text-text-primary font-medium">
                        {subcategories.find(s => s.slug === params.sub)?.label || params.sub}
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

      {/* Subcategory bar (when viewing a category) */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b border-surface-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Link
                href={`/products?category=${params.category}`}
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
                  href={`/products?category=${params.category}&sub=${sub.slug}`}
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
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-text-primary">Filters</h2>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Category</h3>
                <div className="space-y-2">
                  <Link href="/products" className={`block text-sm transition-colors ${!params.category ? 'text-primary-500 font-medium' : 'text-text-secondary hover:text-text-primary'}`}>
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className={`block text-sm transition-colors ${params.category === cat.slug ? 'text-primary-500 font-medium' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm text-text-primary mb-3">Price Range</h3>
                <div className="space-y-2">
                  {["Under ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "₹2000 - ₹5000", "Above ₹5000"].map((price) => (
                    <label key={price} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-surface-400 text-primary-400 focus:ring-primary-400" />
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured filter */}
              <div>
                <Link
                  href={params.featured === "true" ? "/products" : "/products?featured=true"}
                  className={`inline-flex items-center gap-2 text-sm transition-colors ${params.featured === "true" ? 'text-primary-500 font-medium' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <input type="checkbox" checked={params.featured === "true"} readOnly className="w-4 h-4 rounded" />
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
                <p className="text-sm text-text-muted mt-1">Showing {products.length} products</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Sort by:</span>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-400 text-sm hover:bg-surface-100 transition-colors">
                  Featured
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products grid */}
            <ProductGrid products={products} />

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
