import Link from "next/link"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={`h-full w-full ${product.imageClass} transition-transform duration-500 group-hover:scale-[1.02]`}
          />
        )}
        {product.badge && (
          <span
            className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase"
            style={{
              backgroundColor:
                product.badge === "SALE" ? "#B45309" : "var(--theme-primary)",
            }}
          >
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
            Habis
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--theme-text)]">
          {product.name}
        </p>
        <p className="text-xs text-[var(--theme-muted)]">{product.subtitle}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--theme-text)]">
            {formatIdr(displayPrice)}
          </span>
          {product.salePrice != null && (
            <span className="text-xs text-[var(--theme-muted)] line-through">
              {formatIdr(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
