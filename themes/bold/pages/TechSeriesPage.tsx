import { KINETIC_ELITE_V2 } from "@/themes/bold/data/mock"
import { ProductGalleryClient } from "@/themes/bold/sections/tech-series/ProductGalleryClient"
import { FeaturesBento } from "@/themes/bold/sections/tech-series/FeaturesBento"
import { RelatedProducts } from "@/themes/bold/sections/tech-series/RelatedProducts"
import { TechSeriesFooter } from "@/themes/bold/sections/tech-series/TechSeriesFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface TechSeriesPageProps {
  config?: ThemeConfig
}

export function TechSeriesPage({ config = DEFAULT_BOLD_CONFIG }: TechSeriesPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Product Hero */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <ProductGalleryClient product={KINETIC_ELITE_V2} />
      </section>

      {/* Features Bento */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <FeaturesBento />
      </section>

      {/* Related Products */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <RelatedProducts />
      </section>

      <TechSeriesFooter config={config} />
    </div>
  )
}
