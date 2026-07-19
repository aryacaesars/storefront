import Link from "next/link"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import { ProductCard } from "./ProductCard"

const TRENDING_LIMIT = 8

export function ProductGrid({ title, settings, products }: SectionProps & { title?: string }) {
  const displayTitle = getStringSetting(settings, "title", title ?? "Trending Now")
  const isLive = products !== undefined
  const items = isLive
    ? products.slice(0, TRENDING_LIMIT)
    : TRENDING_PRODUCTS.map(mockProductToCatalog)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="mb-8 flex flex-col gap-4 @2xl:flex-row @2xl:items-end @2xl:justify-between">
        <h2
          className="text-3xl font-bold capitalize leading-none text-[#1a1c1b] @2xl:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {displayTitle}
        </h2>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 @2xl:self-auto"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          All Trending Products
        </Link>
      </div>
      {isLive && items.length === 0 ? (
        <p className="text-center text-sm text-[var(--theme-muted)]">
          Belum ada produk untuk ditampilkan.
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
