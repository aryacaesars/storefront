import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { ProductCard } from "./ProductCard"

export function ProductGrid({ title, settings }: SectionProps & { title?: string }) {
  const displayTitle = getStringSetting(settings, "title", title ?? "Trending Now")
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2
        className="mb-10 text-center text-2xl font-semibold text-[var(--theme-text)] @2xl:text-3xl"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        {displayTitle}
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
        {TRENDING_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={mockProductToCatalog(product)} />
        ))}
      </div>
    </section>
  )
}
