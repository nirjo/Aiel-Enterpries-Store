import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import type { Category } from "@/types/database";

const fallbackCategories: Category[] = [
  { id: "1", name: "Sensory Toys", slug: "sensory-toys", description: "Stimulating fidget & sensory toys", image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=400&fit=crop", parent_id: null, sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Montessori Toys", slug: "montessori-toys", description: "Hands-on learning for little ones", image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=400&fit=crop", parent_id: null, sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Educational Toys", slug: "educational-toys", description: "Fun learning through play", image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&h=400&fit=crop", parent_id: null, sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "STEM Toys", slug: "stem-toys", description: "Science, tech & engineering kits", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop", parent_id: null, sort_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Action Figures", slug: "action-figures", description: "Superheroes, anime & collectibles", image_url: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=800&h=400&fit=crop", parent_id: null, sort_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Musical Toys", slug: "musical-toys", description: "Kid-friendly musical instruments", image_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop", parent_id: null, sort_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Board & Card Games", slug: "board-card-games", description: "Family game night essentials", image_url: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800&h=400&fit=crop", parent_id: null, sort_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Wooden Toys", slug: "wooden-toys", description: "Classic handcrafted wooden toys", image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=400&fit=crop", parent_id: null, sort_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Home & Kitchen", slug: "home-kitchen", description: "Smart kitchen & home essentials", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop", parent_id: null, sort_order: 9, is_active: true, created_at: "", updated_at: "" },
  { id: "10", name: "Home Decor", slug: "home-decor", description: "Stylish decor for every room", image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop", parent_id: null, sort_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "11", name: "Gardening", slug: "gardening", description: "Tools, planters & garden decor", image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop", parent_id: null, sort_order: 11, is_active: true, created_at: "", updated_at: "" },
  { id: "12", name: "Gift Items", slug: "gift-items", description: "Curated gifts for every occasion", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=400&fit=crop", parent_id: null, sort_order: 12, is_active: true, created_at: "", updated_at: "" },
  { id: "13", name: "Electronics", slug: "electronics", description: "Gadgets, speakers & accessories", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop", parent_id: null, sort_order: 13, is_active: true, created_at: "", updated_at: "" },
  { id: "14", name: "Stationery Items", slug: "stationery-items", description: "Notebooks, pens & art supplies", image_url: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&h=400&fit=crop", parent_id: null, sort_order: 14, is_active: true, created_at: "", updated_at: "" },
  { id: "15", name: "Sport & Exercise", slug: "sport-exercise", description: "Fitness gear & outdoor sports", image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop", parent_id: null, sort_order: 15, is_active: true, created_at: "", updated_at: "" },
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

  // Get the single "Aiel Toy Paradise" nav entry with all subcategories
  const toyParadiseLink = NAV_LINKS.find(
    (link: NavLink) => link.subcategories && link.subcategories.length > 0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary-100/40 via-[#f8fafc] to-secondary-100/30 py-12 md:py-16 border-b border-primary-200/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-wide mb-3">
            🎉 All Categories
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Explore the Aiel Toy Paradise — toys, home decor, electronics, gifts & more.
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => {
            // Find matching subcategory in the nav link
            const matchingSub = toyParadiseLink?.subcategories?.find(
              (sub) => sub.slug === cat.slug
            );

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/3] border border-primary-200/30 shadow-sm hover:shadow-[0_8px_30px_rgba(65,29,211,0.12)] transition-all duration-300"
              >
                <Image
                  src={cat.image_url || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=400&fit=crop"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23]/70 via-[#0f0f23]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-lg md:text-xl font-display font-bold text-white tracking-wide mb-1 drop-shadow-md">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-white/80">
                      {cat.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-secondary-300 group-hover:text-secondary-200 transition-colors">
                    Shop Now →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
