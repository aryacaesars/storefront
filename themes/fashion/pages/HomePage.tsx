import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { SectionRenderer } from "@/themes/engine/SectionRenderer"
import type { SectionEditorState } from "@/themes/engine/section-editor"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HomePageProps {
  config?: ThemeConfig
  sectionEditor?: SectionEditorState
  products?: CatalogProduct[]
}

export function HomePage({
  config = DEFAULT_FASHION_CONFIG,
  sectionEditor,
  products,
}: HomePageProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <SectionRenderer
        config={config}
        pageType="home"
        editor={sectionEditor}
        products={products}
      />
    </div>
  )
}
