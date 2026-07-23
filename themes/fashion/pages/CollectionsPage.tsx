import { CollectionsHero } from "@/themes/fashion/sections/collections/CollectionsHero"
import { FilterBarClient } from "@/themes/fashion/sections/collections/FilterBarClient"
import { JewelryFilterClient } from "@/themes/fashion/sections/collections/JewelryFilterClient"
import { JewelryGrid } from "@/themes/fashion/sections/collections/JewelryGrid"
import { JournalSection } from "@/themes/fashion/sections/collections/JournalSection"
import { CollectionsFooter } from "@/themes/fashion/sections/collections/CollectionsFooter"
import { ProductGrid } from "@/themes/fashion/sections/shop/ProductGrid"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"
import type { CatalogProduct } from "@/features/storefront/catalog-types"

interface CollectionsPageProps {
  config?: ThemeConfig
  products?: CatalogProduct[]
}

export function CollectionsPage({
  config = DEFAULT_FASHION_CONFIG,
  products,
}: CollectionsPageProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const isLive = products !== undefined

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <CollectionsHero />
      <FilterBarClient totalProducts={isLive ? products.length : 24} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLive ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex gap-10">
            <JewelryFilterClient />
            <JewelryGrid />
          </div>
        )}
      </div>
      <JournalSection />
      <CollectionsFooter config={config} />
    </div>
  )
}
