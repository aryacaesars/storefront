import { ShopHeader } from "@/themes/fashion/sections/shop/ShopHeader"
import { FilterSidebarClient } from "@/themes/fashion/sections/shop/FilterSidebarClient"
import { ProductGrid } from "@/themes/fashion/sections/shop/ProductGrid"
import { Pagination } from "@/themes/fashion/sections/shop/Pagination"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface ShopAllPageProps {
  config?: ThemeConfig
}

export function ShopAllPage({ config = DEFAULT_FASHION_CONFIG }: ShopAllPageProps) {
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
      <ShopFooter config={config} />
    </div>
  )
}
