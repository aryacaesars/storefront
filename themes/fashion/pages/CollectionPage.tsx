import { ProductGrid } from "@/themes/fashion/sections/shop/ProductGrid"
import { CollectionsFooter } from "@/themes/fashion/sections/collections/CollectionsFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({
  config = DEFAULT_FASHION_CONFIG,
  slug = "jewelry",
  category,
  products = [],
}: ThemePageProps) {
  const isLive = category !== undefined
  const title = category?.name ?? slugToTitle(slug)

  if (isLive && category === null) {
    return (
      <div style={{ backgroundColor: "var(--theme-bg)" }}>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm text-[var(--theme-muted)]">
            Produk dengan Kategori {slugToTitle(slug)} belum tersedia
          </p>
        </div>
        <CollectionsFooter config={config} />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="border-b border-black/5 px-6 py-12 text-center">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
          Collection
        </p>
        <h1
          className="mt-2 text-4xl font-medium text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h1>
      </section>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLive && products.length === 0 ? (
          <p className="text-center text-sm text-[var(--theme-muted)]">
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <ProductGrid products={isLive ? products : undefined} />
        )}
      </div>
      <CollectionsFooter config={config} />
    </div>
  )
}
