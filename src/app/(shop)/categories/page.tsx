import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import type { Category } from "@/types/database";

const fallbackCategories: Category[] = [
  { id: "1", name: "Levitation Toys", slug: "levitation-toys", description: "Magnetic floating gadgets that defy gravity", image_url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Gyroscopes & Spinners", slug: "gyroscopes", description: "Precision spinning toys & mesmerizing motion", image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "STEM Kits", slug: "stem-kits", description: "Hands-on science experiments & learning kits", image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Magnetic Gadgets", slug: "magnetic-gadgets", description: "Ferrofluid art, magnetic putty & more", image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Space & Gravity", slug: "space-gravity", description: "Explore cosmic wonders & physics toys", image_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
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
    <div className="min-h-screen bg-[#050510]">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary-400/10 via-[#050510] to-accent-400/10 py-12 md:py-16 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide mb-3">
            🧲 All Categories
          </h1>
          <p className="text-text-muted max-w-lg mx-auto">
            Explore our anti-gravity toy universe — levitation, gyroscopes, STEM kits, magnets & space gadgets.
          </p>
        </div>
      </div>

      {/* Categories with subcategories */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="space-y-16">
          {categories.map((cat) => {
            const navLink = NAV_LINKS.find(
              (link: NavLink) => link.href.includes(`category=${cat.slug}`) && link.subcategories
            );
            const subcategories = navLink?.subcategories || [];

            return (
              <section key={cat.id}>
                {/* Category hero */}
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[3/1] md:aspect-[4/1] mb-6 glow-border"
                >
                  <Image
                    src={cat.image_url || "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=400&fit=crop"}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/80 via-[#050510]/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center p-6 md:p-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white tracking-wide mb-2 drop-shadow-[0_0_20px_rgba(0,123,255,0.3)]">
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-sm md:text-base text-white/70 max-w-md">
                          {cat.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-accent-400 group-hover:text-accent-300 transition-colors">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Subcategory grid */}
                {subcategories.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/products?category=${cat.slug}&sub=${sub.slug}`}
                        className="group relative rounded-xl overflow-hidden aspect-square glow-border"
                      >
                        <Image
                          src={sub.image}
                          alt={sub.label}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 12.5vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-[11px] font-medium leading-tight truncate">
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
