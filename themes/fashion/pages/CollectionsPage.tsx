import { CollectionsHero } from "@/themes/fashion/sections/collections/CollectionsHero"
import { FilterBarClient } from "@/themes/fashion/sections/collections/FilterBarClient"
import { JewelryFilterClient } from "@/themes/fashion/sections/collections/JewelryFilterClient"
import { JewelryGrid } from "@/themes/fashion/sections/collections/JewelryGrid"
import { JournalSection } from "@/themes/fashion/sections/collections/JournalSection"
import { CollectionsFooter } from "@/themes/fashion/sections/collections/CollectionsFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface CollectionsPageProps {
  config?: ThemeConfig
}

export function CollectionsPage({ config = DEFAULT_FASHION_CONFIG }: CollectionsPageProps) {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <CollectionsHero />
      <FilterBarClient totalProducts={24} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-10">
          <JewelryFilterClient />
          <JewelryGrid />
        </div>
      </div>
      <JournalSection />
      <CollectionsFooter config={config} />
    </div>
  )
}
