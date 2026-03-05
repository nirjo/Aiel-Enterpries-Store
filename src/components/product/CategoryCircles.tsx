"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";

interface CategoryCirclesProps {
  /** Categories to render as circular image buttons */
  categories: Category[];
  /** Currently active category slug (gets highlighted ring) */
  activeSlug?: string;
}

export function CategoryCircles({ categories, activeSlug }: CategoryCirclesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="categories-circles-container" role="navigation" aria-label="Browse categories">
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-2 no-underline"
            aria-current={isActive ? "page" : undefined}
          >
            <div
              className={`cat-circle ${isActive ? "cat-circle--active" : ""}`}
              data-name={cat.name}
            >
              <Image
                src={
                  cat.image_url ||
                  `https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop`
                }
                alt={cat.name}
                fill
                className="object-cover"
                sizes="(max-width: 479px) 90px, (max-width: 768px) 110px, (max-width: 1024px) 120px, 130px"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
