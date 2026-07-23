import { ShopHeader } from "@/themes/fashion/sections/shop/ShopHeader"
import { ProductCatalogFilters } from "@/features/storefront/ProductCatalogFilters"
import { ProductGrid } from "@/themes/fashion/sections/shop/ProductGrid"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ShopAllPage({
  config = DEFAULT_FASHION_CONFIG,
  products,
  categories = [],
  priceBounds = null,
  catalogFilters = {},
}: ThemePageProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const isLive = products !== undefined

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <ShopHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLive && (
          <div className="mb-10">
            <ProductCatalogFilters
              categories={categories}
              priceBounds={priceBounds}
              active={catalogFilters}
              resultCount={products?.length ?? 0}
              variant="fashion"
            />
          </div>
        )}
        <ProductGrid products={products} />
      </div>
      <ShopFooter config={config} />
    </div>
  )
}
