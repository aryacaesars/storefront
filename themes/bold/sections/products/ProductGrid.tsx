import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { ProductCard } from "@/themes/bold/sections/products/ProductCard"

interface ProductGridProps {
  products: CatalogProduct[]
  liveCatalog?: boolean
}

export function ProductGrid({ products, liveCatalog = false }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Belum ada produk visible di katalog Scalev.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          liveCatalog={liveCatalog}
        />
      ))}
    </div>
  )
}
