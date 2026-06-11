import { ProductGrid } from "@/themes/minimalist/sections/ProductGrid"

export default function ProductsPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-6 pb-4">
        <h1
          className="text-3xl font-semibold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          The Complete Collection
        </h1>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">
          Curated essentials for the modern intentionalist.
        </p>
      </div>
      <ProductGrid title="All Products" />
    </div>
  )
}
