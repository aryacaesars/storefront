import { mockProductToCatalog, PRODUCTS } from "@/themes/bold/data/mock"
import { ProductsHeader } from "@/themes/bold/sections/products/ProductsHeader"
import { ProductCatalogFilters } from "@/features/storefront/ProductCatalogFilters"
import { ProductGrid } from "@/themes/bold/sections/products/ProductGrid"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import type { StorefrontCategory } from "@/features/storefront/catalog-types"
import type { CatalogListFilters } from "@/features/storefront/catalog-types"

interface AllProductsPageProps {
  products?: CatalogProduct[]
  categories?: StorefrontCategory[]
  priceBounds?: { min: number; max: number } | null
  catalogFilters?: CatalogListFilters
}

export function AllProductsPage({
  products = [],
  categories = [],
  priceBounds = null,
  catalogFilters = {},
}: AllProductsPageProps) {
  const isLive = products.length > 0 || categories.length > 0 || priceBounds != null
  const items = isLive ? products : PRODUCTS.map(mockProductToCatalog)

  return (
    <div className="min-h-screen bg-white">
      <ProductsHeader
        totalCount={items.length}
        subtitle={
          isLive
            ? "Cari dan filter produk dari katalog toko Anda."
            : "Precision engineered for the high-endurance athlete."
        }
      />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLive && (
          <div className="mb-8">
            <ProductCatalogFilters
              categories={categories}
              priceBounds={priceBounds}
              active={catalogFilters}
              resultCount={products.length}
              variant="bold"
            />
          </div>
        )}
        <ProductGrid products={items} liveCatalog={isLive} />
      </div>
    </div>
  )
}
