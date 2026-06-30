import Link from "next/link"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import { mockShopToCatalog, SHOP_PRODUCTS } from "@/themes/fashion/data/mock"

interface ProductGridProps {
  products?: CatalogProduct[]
}

export function ProductGrid({ products = [] }: ProductGridProps) {
  const isLive = products.length > 0
  const items = isLive ? products : SHOP_PRODUCTS.map(mockShopToCatalog)

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--theme-muted)]">
        Belum ada produk visible di katalog.
      </p>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      {isLive && (
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]">
          Katalog · {items.length} produk
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
        {items.map((p) => {
          const displayPrice = p.salePrice ?? p.price
          return (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group">
              <div className="relative aspect-[3/4] overflow-hidden">
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
                  <span
                    className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white"
                    style={{ backgroundColor: "#B5A642" }}
                  >
                    {p.badge}
                  </span>
                )}
                {!p.inStock && (
                  <span className="absolute right-3 top-3 bg-black/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                    Habis
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm leading-snug text-[var(--theme-text)] group-hover:underline">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--theme-muted)]">
                  {isLive
                    ? formatIdr(displayPrice)
                    : `$${displayPrice.toLocaleString()}`}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
