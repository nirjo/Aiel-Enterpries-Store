import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui";
import type { Product } from "@/types/database";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No products found.</p>
      </div>
    );
  }

  // Mobile-first: always 2 columns side-by-side (works on 360px budget Androids)
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
