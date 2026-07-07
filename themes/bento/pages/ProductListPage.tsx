import { ProductCard } from "@/themes/bento/sections/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({ config: _config, products = [] }: ThemePageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="mb-10 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
          Shop
        </p>
        <h1
          className="mt-2 text-3xl font-bold text-[#1a1c1b] @2xl:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          All Products
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[#515160]">
          Bold objects and accessories with sharp, product-first industrial design.
        </p>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-[#515160]">Belum ada produk tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
