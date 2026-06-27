import { mockProductToCatalog, PRODUCTS } from "@/themes/bold/data/mock"
import { ProductsHeader } from "@/themes/bold/sections/products/ProductsHeader"
import { FilterSidebar } from "@/themes/bold/sections/products/FilterSidebar"
import { ProductGrid } from "@/themes/bold/sections/products/ProductGrid"
import { Pagination } from "@/themes/bold/sections/products/Pagination"
import type { CatalogProduct } from "@/features/storefront/catalog-types"

interface AllProductsPageProps {
  products?: CatalogProduct[]
}

export function AllProductsPage({ products = [] }: AllProductsPageProps) {
  const isLive = products.length > 0
  const items = isLive ? products : PRODUCTS.map(mockProductToCatalog)

  return (
    <div className="min-h-screen bg-white">
      <ProductsHeader
        totalCount={items.length}
        subtitle={
          isLive
            ? "Produk langsung dari katalog Scalev toko Anda."
            : "Precision engineered for the high-endurance athlete."
        }
      />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start gap-8">
          <FilterSidebar />
          <div className="min-w-0 flex-1">
            <ProductGrid products={items} liveCatalog={isLive} />
            {!isLive && <Pagination currentPage={1} totalPages={10} />}
          </div>
        </div>
      </div>
    </div>
  )
}
