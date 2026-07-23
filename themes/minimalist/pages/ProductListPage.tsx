import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import { ProductCatalogFilters } from "@/features/storefront/ProductCatalogFilters"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({
  config: _config,
  products,
  categories = [],
  priceBounds = null,
  catalogFilters = {},
}: ThemePageProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const isLive = products !== undefined
  const items = products ?? TRENDING_PRODUCTS.map(mockProductToCatalog)

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
        Shop
      </p>
      <h1
        className="mt-1 text-2xl font-semibold text-[var(--theme-text)] @2xl:text-3xl"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        All Products
      </h1>

      {isLive && (
        <div className="mt-4">
          <ProductCatalogFilters
            categories={categories}
            priceBounds={priceBounds}
            active={catalogFilters}
            resultCount={items.length}
            variant="minimalist"
          />
        </div>
      )}

      {!isLive && (
        <p className="mt-2 max-w-xl text-sm text-[var(--theme-muted)]">
          Belum ada katalog terhubung — menampilkan contoh produk.
        </p>
      )}

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--theme-muted)]">
          Tidak ada produk yang cocok dengan filter.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
