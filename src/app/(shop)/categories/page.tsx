import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryCircles } from "@/components/product/CategoryCircles";
import type { Category } from "@/types/database";

export const revalidate = 0; // always fetch fresh from Supabase

const fallbackCategories: Category[] = [
  { id: "1", name: "Aiel Toy Paradise", slug: "toys", description: "Fun toys for every age", image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Wooden Toys", slug: "wooden-toys", description: "Classic handcrafted wooden toys", image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Home & Kitchen", slug: "home-kitchen", description: "Smart kitchen & home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Electronics", slug: "electronics", description: "Gadgets, speakers & accessories", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Gardening", slug: "gardening", description: "Tools, planters & garden decor", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Home Decor", slug: "home-decor", description: "Stylish decor for every room", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Stationery Items", slug: "stationery-items", description: "Notebooks, pens & art supplies", image_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=400&fit=crop", parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Sport & Exercise", slug: "sport-exercise", description: "Fitness gear & outdoor sports", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Gift Items", slug: "gift-items", description: "Curated gifts for every occasion", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop", parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
];

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }) as { data: Category[] | null; error: unknown };

    if (error || !data || data.length === 0) return fallbackCategories;
    return data;
  } catch {
    return fallbackCategories;
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Breadcrumb ── */}
      <div className="bg-surface-50 border-b border-surface-200 pt-6 pb-4 shadow-sm">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary-500 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li className="text-text-muted">›</li>
              <li className="text-text-primary font-semibold">All Categories</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#fff5f7] via-white to-[#ffeef2] py-10 md:py-14 border-b border-[var(--header-border)]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--header-text)] tracking-wide mb-3">
            🎉 Shop by Category
          </h1>
          <p className="text-[var(--cat-text)] max-w-lg mx-auto">
            Explore our curated collections — toys, home decor, electronics, gifts & more.
          </p>
        </div>
      </div>

      {/* Category circles */}
      <div className="container mx-auto px-4">
        <CategoryCircles categories={categories} />
      </div>

      {/* Description section */}
      <div className="container mx-auto px-4 pb-12 text-center">
        <p className="text-sm text-[var(--cat-text)]/70 max-w-2xl mx-auto">
          Click any category to browse products. We ship across India with free delivery on orders over ₹999! 🚀
        </p>
      </div>
    </div>
  );
}
