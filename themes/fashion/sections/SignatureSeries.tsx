import Link from "next/link"
import { formatIdr } from "@/features/storefront/catalog-types"
import { FEATURED_PRODUCTS } from "@/themes/fashion/data/mock"
import type { SectionProps } from "@/themes/engine/section-registry"
import {
  CanvasSectionText,
  findSectionTextBlock,
} from "@/features/builder/components/canvas/CanvasSectionText"

const FEATURED_LIMIT = 4

export function SignatureSeries({ products, blocks, canvas }: SectionProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const isLive = products !== undefined

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <CanvasSectionText
            canvas={canvas}
            block={findSectionTextBlock(blocks, "fashion-signature-eyebrow")}
            fallback="CURATED SELECTION"
            basePx={10}
            className="tracking-[0.2em] uppercase text-[var(--theme-muted)]"
          />
          <CanvasSectionText
            canvas={canvas}
            block={findSectionTextBlock(blocks, "fashion-signature-title")}
            fallback="The Signature Series"
            basePx={30}
            as="h2"
            className="mt-2 font-medium text-[var(--theme-text)]"
            baseStyle={{ fontFamily: "var(--theme-heading-font)" }}
          />
        </div>
        <Link
          href="/products"
          className="text-xs tracking-wide text-[var(--theme-muted)] underline hover:text-[var(--theme-text)]"
        >
          View All Products
        </Link>
      </div>

      {isLive ? (
        products.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--theme-muted)]">
            Belum ada produk untuk ditampilkan.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.slice(0, FEATURED_LIMIT).map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className={`h-full w-full ${p.imageClass}`} />
                  )}
                  {p.badge && (
                    <span className="absolute right-3 top-3 bg-[var(--theme-text)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-[var(--theme-text)] group-hover:underline">
                    {p.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-[var(--theme-muted)]">
                    {formatIdr(p.salePrice ?? p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {FEATURED_PRODUCTS.map((p) => (
            <div key={p.id}>
              <div className={`relative aspect-[3/4] overflow-hidden rounded-sm ${p.imageClass}`}>
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                )}
                {p.badge && (
                  <span className="absolute right-3 top-3 bg-[var(--theme-text)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-[var(--theme-text)]">{p.name}</h3>
                <p className="mt-0.5 text-sm text-[var(--theme-muted)]">{formatIdr(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
