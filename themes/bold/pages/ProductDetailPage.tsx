import { KINETIC_ELITE_V2 } from "@/themes/bold/data/mock"
import { ProductGalleryClient } from "@/themes/bold/sections/tech-series/ProductGalleryClient"
import { RelatedProducts } from "@/themes/bold/sections/tech-series/RelatedProducts"
import { TechSeriesFooter } from "@/themes/bold/sections/tech-series/TechSeriesFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductDetailPage({
  config = DEFAULT_BOLD_CONFIG,
  slug: _slug,
}: ThemePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <ProductGalleryClient product={KINETIC_ELITE_V2} />
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <RelatedProducts />
      </section>
      <TechSeriesFooter config={config} />
    </div>
  )
}
