import { KINETIC_ELITE_V2 } from "@/themes/bold/data/mock"
import { catalogToBoldDetail } from "@/themes/bold/lib/catalog-to-detail"
import { ProductGalleryClient } from "@/themes/bold/sections/tech-series/ProductGalleryClient"
import { RelatedProducts } from "@/themes/bold/sections/tech-series/RelatedProducts"
import { TechSeriesFooter } from "@/themes/bold/sections/tech-series/TechSeriesFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { ProductNotFound } from "@/features/storefront/ProductNotFound"
import { resolveProductDetail } from "@/features/storefront/resolve-catalog-product"

export function ProductDetailPage({
  config = DEFAULT_BOLD_CONFIG,
  slug,
  product,
  products = [],
}: ThemePageProps) {
  const { product: resolved, related, isLiveCatalog } = resolveProductDetail(
    slug,
    product,
    products,
    [],
  )

  if (!resolved && isLiveCatalog) {
    return (
      <div className="min-h-screen bg-white">
        <ProductNotFound />
        <TechSeriesFooter config={config} />
      </div>
    )
  }

  const galleryProduct =
    resolved && isLiveCatalog ? catalogToBoldDetail(resolved) : KINETIC_ELITE_V2

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <ProductGalleryClient product={galleryProduct} />
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <RelatedProducts products={isLiveCatalog ? related : undefined} />
      </section>
      <TechSeriesFooter config={config} />
    </div>
  )
}
