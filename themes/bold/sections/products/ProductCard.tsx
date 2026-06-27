import Link from "next/link"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"

interface ProductCardProps {
  product: CatalogProduct
  /** Use IDR formatting for live Scalev catalog; USD for mock preview. */
  liveCatalog?: boolean
}

function badgeStyle(badge: CatalogProduct["badge"]): React.CSSProperties {
  if (badge === "SALE") return { backgroundColor: "#EF4444" }
  return { backgroundColor: "var(--theme-primary)" }
}

export function ProductCard({ product, liveCatalog = false }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price
  const priceLabel = liveCatalog
    ? formatIdr(displayPrice)
    : `$${displayPrice.toFixed(2)}`
  const strikeLabel =
    product.salePrice != null
      ? liveCatalog
        ? formatIdr(product.price)
        : `$${product.price.toFixed(2)}`
      : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block overflow-hidden rounded-sm border border-gray-100 bg-white transition-shadow hover:shadow-sm"
    >
      <div className={`relative aspect-square ${product.imageClass}`}>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : null}
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white"
            style={badgeStyle(product.badge)}
          >
            {product.badge === "NEW" ? "NEW RELEASE" : product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-sm bg-zinc-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white">
            SOLD OUT
          </span>
        )}
      </div>

      <div className="px-4 py-4">
        <p
          className="text-base font-black leading-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {product.name}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
            {priceLabel}
          </span>
          {strikeLabel && (
            <span className="text-sm text-zinc-400 line-through">{strikeLabel}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
