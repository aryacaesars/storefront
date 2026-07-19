import { ProductCard } from "@/themes/bento/sections/ProductCard"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({
  slug = "home-objects",
  category,
  products = [],
}: ThemePageProps) {
  const isLive = category !== undefined
  const title = category?.name ?? slugToTitle(slug)

  if (isLive && category === null) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center @2xl:px-6">
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
      <div className="mx-auto max-w-7xl px-4 pb-4 @2xl:px-6">
        <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Home / Collections / {title}
          </p>
          <h1
            className="mt-2 text-3xl font-bold capitalize text-[#1a1c1b]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {title}
          </h1>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-[var(--theme-muted)]">
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
