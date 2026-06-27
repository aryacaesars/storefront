import { mockProductToCatalog, PRODUCTS } from "@/themes/bold/data/mock"
import { ProductsHeader } from "@/themes/bold/sections/products/ProductsHeader"
import { FilterSidebar } from "@/themes/bold/sections/products/FilterSidebar"
import { ProductGrid } from "@/themes/bold/sections/products/ProductGrid"
import { Pagination } from "@/themes/bold/sections/products/Pagination"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({ config, slug = "running" }: ThemePageProps) {
  const title = slugToTitle(slug)

  return (
    <>
      <div className="min-h-screen bg-white">
        <ProductsHeader totalCount={PRODUCTS.length} title={title} />
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start gap-8">
            <FilterSidebar />
            <div className="min-w-0 flex-1">
              <ProductGrid products={PRODUCTS.map(mockProductToCatalog)} />
              <Pagination currentPage={1} totalPages={4} />
            </div>
          </div>
        </div>
      </div>
      <PerformanceFooter config={config} />
    </>
  )
}
