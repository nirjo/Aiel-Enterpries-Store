import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import type { Category } from "@/types/database";

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Explore our product categories and find exactly what you need",
};

const fallbackCategories: Category[] = [
  { id: "1", name: "Toy Paradise", slug: "toy-paradise", description: "Fun and educational toys for children of all ages", image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=600&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Home Decor", slug: "home-decor", description: "Beautiful decorations to transform your living space", image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Kitchen Items", slug: "kitchen-items", description: "Essential tools and accessories for your kitchen", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Gardening", slug: "gardening", description: "Everything you need for a thriving garden", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Gift Items", slug: "gift-items", description: "Perfect gifts for every occasion and loved one", image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=800&h=600&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
];

// Get subcategories for a given category slug
function getSubcategoriesForCategory(categorySlug: string) {
  const navLink = NAV_LINKS.find(
    (link: NavLink) => link.href.includes(`category=${categorySlug}`) && link.subcategories
  );
  return navLink?.subcategories || [];
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .is("parent_id", null)
      .order("sort_order", { ascending: true }) as { data: Category[] | null; error: unknown };

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }
    return data;
  } catch {
    return fallbackCategories;
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 md:py-16 border-b border-surface-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3">
            Browse Categories
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Explore our curated collections — from toys to home decor, kitchen essentials to gardening, and the perfect gifts.
          </p>
        </div>
      </div>

      {/* Category cards */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="space-y-16">
          {categories.map((cat) => {
            const subcategories = getSubcategoriesForCategory(cat.slug);
            return (
              <section key={cat.id}>
                {/* Category header with large hero image */}
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[3/1] md:aspect-[4/1] mb-6"
                >
                  <Image
                    src={cat.image_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                      {cat.name}
                    </h2>
                    {cat.description && (
                      <p className="text-white/80 text-sm md:text-base max-w-md">
                        {cat.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      View All Products →
                    </span>
                  </div>
                </Link>

                {/* Subcategory grid */}
                {subcategories.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/products?category=${cat.slug}&sub=${sub.slug}`}
                        className="group/card flex flex-col rounded-xl overflow-hidden border border-surface-200 hover:border-primary-300 hover:shadow-medium transition-all duration-300 bg-white"
                      >
                        <div className="relative aspect-square overflow-hidden bg-surface-100">
                          <Image
                            src={sub.image}
                            alt={sub.label}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 12.5vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                        <div className="p-2.5 text-center">
                          <p className="text-xs font-semibold text-text-primary group-hover/card:text-primary-500 transition-colors leading-tight">
                            {sub.label}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
