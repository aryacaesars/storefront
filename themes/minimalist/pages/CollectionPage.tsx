import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({
  slug = "ready-to-wear",
  category,
  products = [],
}: ThemePageProps) {
  const isLive = category !== undefined
  const title = category?.name ?? slugToTitle(slug)

  if (isLive && category === null) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm text-[var(--theme-muted)]">
            Produk dengan Kategori {slugToTitle(slug)} belum tersedia
          </p>
        </div>
      </div>
    )
  }

  const items = isLive ? products : TRENDING_PRODUCTS.map(mockProductToCatalog)

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-6 pb-4">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
          Home / Collections / {title}
        </p>
        <h1
          className="mt-2 text-3xl font-semibold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h1>
      </div>
      <section className="mx-auto max-w-7xl px-6 py-16">
        {items.length === 0 ? (
          <p className="text-center text-sm text-[var(--theme-muted)]">
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
