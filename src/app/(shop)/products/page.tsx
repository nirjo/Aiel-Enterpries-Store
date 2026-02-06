import { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of premium products",
};

// Fallback products when database is empty
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

const fallbackCategories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", description: "", image_url: "", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Fashion", slug: "fashion", description: "", image_url: "", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Home & Living", slug: "home-living", description: "", image_url: "", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Sports", slug: "sports", description: "", image_url: "", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
];

async function getProducts(searchParams: { category?: string; featured?: string; search?: string }): Promise<Product[]> {
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
        .single();
      
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    if (searchParams.featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return fallbackProducts;
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
      .order("sort_order", { ascending: true });

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
  searchParams: Promise<{ category?: string; featured?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

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
              <li className="text-text-primary font-medium">Products</li>
            </ol>
          </nav>
        </div>
      </div>

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
                  {params.category ? categories.find(c => c.slug === params.category)?.name || "Products" : "All Products"}
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
