"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/database";

interface FilterOption {
  label: string;
  value: string;
  href: string;
}

interface CategorySectionProps {
  /** Category title shown in the h2 */
  title: string;
  /** Products to display in the grid */
  products: Product[];
  /** Optional filter chips shown alongside the title */
  filters?: FilterOption[];
  /** Currently active filter value */
  activeFilter?: string;
  /** Whether to make the header sticky while scrolling */
  stickyHeader?: boolean;
  /** Number of columns on desktop (default 4) */
  desktopColumns?: 2 | 3 | 4;
  /** Optional trailing link e.g. "View All →" */
  viewAllHref?: string;
}

export function CategorySection({
  title,
  products,
  filters = [],
  activeFilter,
  stickyHeader = false,
  desktopColumns = 4,
  viewAllHref,
}: CategorySectionProps) {
  return (
    <section className="category-section">
      {/* ── Category header ─────────────────────────────────────────────── */}
      <div className={`category-header${stickyHeader ? " category-header--sticky" : ""}`}>
        <div className="category-header__inner">
          <h2 className="category-header__title">{title}</h2>

          <div className="category-header__filters" role="group" aria-label="Filter products">
            {filters.map((f) => (
              <Link
                key={f.value}
                href={f.href}
                aria-pressed={activeFilter === f.value}
                className={`category-filter-btn${activeFilter === f.value ? " category-filter-btn--active" : ""}`}
              >
                {f.label}
              </Link>
            ))}

            {viewAllHref && (
              <Link href={viewAllHref} className="category-filter-btn category-filter-btn--view-all">
                View All →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      {products.length > 0 ? (
        <div
          className={`products-grid products-grid--cols-${desktopColumns}`}
          aria-label={`${title} products`}
        >
          {products.map((product, index) => (
            <div key={product.id} className="product-card">
              <ProductCard product={product} priority={index < 4} />
            </div>
          ))}
        </div>
      ) : (
        <div className="products-grid products-grid--empty">
          <SlidersHorizontal className="h-8 w-8 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">No products in this category yet.</p>
        </div>
      )}
    </section>
  );
}
