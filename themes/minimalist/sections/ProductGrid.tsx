import Link from "next/link"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { getStringSetting } from "@/themes/engine/section-settings-schema"
import type { SectionProps } from "@/themes/engine/section-registry"
import {
  CanvasSectionText,
  findSectionTextBlock,
} from "@/features/builder/components/canvas/CanvasSectionText"
import { ProductCard } from "./ProductCard"

const TRENDING_LIMIT = 8

export function ProductGrid({
  title,
  settings,
  blocks,
  canvas,
  products,
}: SectionProps & { title?: string }) {
  const displayTitle = getStringSetting(settings, "title", title ?? "Trending Now")
  const titleBlock = findSectionTextBlock(blocks, "minimalist-grid-title")
  const isLive = products !== undefined
  const items = isLive
    ? products.slice(0, TRENDING_LIMIT)
    : TRENDING_PRODUCTS.map(mockProductToCatalog)

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CanvasSectionText
          canvas={canvas}
          block={titleBlock}
          fallback={displayTitle}
          basePx={30}
          as="h2"
          className="text-center font-semibold text-[var(--theme-text)] sm:text-left"
          baseStyle={{ fontFamily: "var(--theme-heading-font)" }}
        />
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--theme-text)]/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-text)] transition-colors hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
        >
          All Trending Products
        </Link>
      </div>
      {isLive && items.length === 0 ? (
        <p className="text-center text-sm text-[var(--theme-muted)]">
          Belum ada produk untuk ditampilkan.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 @3xl:grid-cols-4 @3xl:gap-x-6 @3xl:gap-y-10">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
