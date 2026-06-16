import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import { TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({ config: _config }: ThemePageProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
        Shop
      </p>
      <h1
        className="mt-2 text-3xl font-semibold text-[var(--theme-text)] @2xl:text-4xl"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        All Products
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--theme-muted)]">
        Consciously crafted essentials — designed to outlast trends.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
        {TRENDING_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
