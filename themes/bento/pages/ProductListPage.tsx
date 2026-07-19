import { ProductCard } from "@/themes/bento/sections/ProductCard"
import { ProductCatalogFilters } from "@/features/storefront/ProductCatalogFilters"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductListPage({
  config: _config,
  products = [],
  categories = [],
  priceBounds = null,
  catalogFilters = {},
}: ThemePageProps) {
  const isLive = products.length > 0 || Boolean(categories.length) || priceBounds != null
  const items =
    isLive || products.length > 0
      ? products
      : TRENDING_PRODUCTS.map(mockProductToCatalog)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 @2xl:px-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Shop
          </p>
          <h1
            className="mt-1 text-2xl font-bold text-[#1a1c1b] @2xl:text-3xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            All Products
          </h1>
        </div>
      </div>

      {isLive && (
        <div className="mb-5">
          <ProductCatalogFilters
            categories={categories}
            priceBounds={priceBounds}
            active={catalogFilters}
            resultCount={products.length}
            variant="bento"
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-[#515160]">
          Tidak ada produk yang cocok dengan filter.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
