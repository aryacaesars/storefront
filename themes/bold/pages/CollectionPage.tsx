import { mockProductToCatalog, PRODUCTS } from "@/themes/bold/data/mock"
import { ProductsHeader } from "@/themes/bold/sections/products/ProductsHeader"
import { FilterSidebar } from "@/themes/bold/sections/products/FilterSidebar"
import { ProductGrid } from "@/themes/bold/sections/products/ProductGrid"
import { Pagination } from "@/themes/bold/sections/products/Pagination"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({
  config,
  slug = "running",
  category,
  products = [],
}: ThemePageProps) {
  const isLive = category !== undefined
  const title = category?.name ?? slugToTitle(slug)

  if (isLive && category === null) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <p className="text-sm text-zinc-600">
              Produk dengan Kategori {slugToTitle(slug)} belum tersedia
            </p>
          </div>
        </div>
        <PerformanceFooter config={config} />
      </>
    )
  }

  const items = isLive ? products : PRODUCTS.map(mockProductToCatalog)

  return (
    <>
      <div className="min-h-screen bg-white">
        <ProductsHeader totalCount={items.length} title={title} />
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start gap-8">
            <FilterSidebar />
            <div className="min-w-0 flex-1">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-600">Belum ada produk di kategori ini.</p>
              ) : (
                <ProductGrid products={items} liveCatalog={isLive} />
              )}
              {!isLive && <Pagination currentPage={1} totalPages={4} />}
            </div>
          </div>
        </div>
      </div>
      <PerformanceFooter config={config} />
    </>
  )
}
