import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { Header, Footer as MinimalistFooter } from "@/themes/minimalist"
import { Header as BentoHeader, Footer as BentoFooter } from "@/themes/bento"
import { Navbar as BoldNavbar, Footer as BoldFooter } from "@/themes/bold"
import { Navbar as FashionNavbar } from "@/themes/fashion/sections/Navbar"
import { templatePages } from "./registry"
import type { SectionEditorState } from "./section-editor"
import type { ThemeConfig } from "./schema"

interface ThemeHomeViewProps {
  config: ThemeConfig
  sectionEditor?: SectionEditorState
  /** Live catalog — omit in builder/preview so sections keep mock data. */
  products?: CatalogProduct[]
}

export function ThemeHomeView({ config, sectionEditor, products }: ThemeHomeViewProps) {
  const pages = templatePages[config.templateId]
  if (!pages) return null

  const HomePage = pages.home

  switch (config.templateId) {
    case "bold":
      return (
        <div className="relative flex min-h-full flex-1 flex-col">
          <BoldNavbar config={config} transparent />
          <main className="flex-1">
            <HomePage config={config} sectionEditor={sectionEditor} products={products} />
          </main>
          <BoldFooter config={config} />
        </div>
      )
    case "fashion":
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <FashionNavbar config={config} />
          <main className="flex-1">
            <HomePage config={config} sectionEditor={sectionEditor} products={products} />
          </main>
        </div>
      )
    case "bento":
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <BentoHeader config={config} />
          <main className="flex-1">
            <HomePage config={config} sectionEditor={sectionEditor} products={products} />
          </main>
          <BentoFooter config={config} />
        </div>
      )
    default:
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <Header config={config} />
          <main className="flex-1">
            <HomePage config={config} sectionEditor={sectionEditor} products={products} />
          </main>
          <MinimalistFooter config={config} />
        </div>
      )
  }
}
