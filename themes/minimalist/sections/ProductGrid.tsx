import { TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { ProductCard } from "./ProductCard"

interface ProductGridProps {
  title?: string
}

export function ProductGrid({ title = "Trending Now" }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2
        className="mb-10 text-center text-2xl font-semibold text-[var(--theme-text)] sm:text-3xl"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {TRENDING_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
