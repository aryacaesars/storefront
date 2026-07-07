import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({ config: _config, products = [] }: ThemePageProps) {
  const items =
    products.length > 0 ? products : TRENDING_PRODUCTS.map(mockProductToCatalog)

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
        {products.length > 0
          ? "Produk langsung dari katalog toko Anda."
          : "Belum ada katalog terhubung — menampilkan contoh produk."}
      </p>
      {items.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--theme-muted)]">
          Belum ada produk visible di storefront.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
