import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { ProductCard } from "./ProductCard"

export function ProductGrid({ title, settings }: SectionProps & { title?: string }) {
  const displayTitle = getStringSetting(settings, "title", title ?? "Trending Now")

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2
          className="text-3xl font-bold capitalize leading-none text-[#1a1c1b] @2xl:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {displayTitle}
        </h2>
        <span className="h-1.5 w-16 shrink-0 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }} />
      </div>
      <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
        {TRENDING_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={mockProductToCatalog(product)} />
        ))}
      </div>
    </section>
  )
}
