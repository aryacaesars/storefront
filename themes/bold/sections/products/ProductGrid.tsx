import type { MockProduct } from "@/themes/bold/data/mock"
import { ProductCard } from "@/themes/bold/sections/products/ProductCard"

interface ProductGridProps {
  products: MockProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
