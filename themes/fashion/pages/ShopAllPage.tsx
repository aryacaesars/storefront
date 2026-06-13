import { ShopHeader } from "@/themes/fashion/sections/shop/ShopHeader"
import { FilterSidebarClient } from "@/themes/fashion/sections/shop/FilterSidebarClient"
import { ProductGrid } from "@/themes/fashion/sections/shop/ProductGrid"
import { Pagination } from "@/themes/fashion/sections/shop/Pagination"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"

export function ShopAllPage() {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <ShopHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-12">
          <FilterSidebarClient />
          <div className="flex-1 min-w-0">
            <ProductGrid />
            <Pagination />
          </div>
        </div>
      </div>
      <ShopFooter />
    </div>
  )
}
