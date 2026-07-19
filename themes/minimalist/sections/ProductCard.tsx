import Link from "next/link"
import Image from "next/image"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price
  const outOfStock = product.inStock === false

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 ring-1 ring-black/[0.04]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className={`h-full w-full ${product.imageClass} transition-transform duration-500 ease-out group-hover:scale-[1.02]`}
          />
        )}

        {product.badge && (
          <span
            className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
            style={{
              backgroundColor:
                product.badge === "SALE" ? "#B45309" : "var(--theme-primary)",
            }}
          >
            {product.badge}
          </span>
        )}

        {outOfStock && (
          <span className="absolute right-3 top-3 bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
            Habis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--theme-text)] transition-colors group-hover:text-[var(--theme-primary)]">
          {product.name}
        </p>
        {product.subtitle && product.subtitle !== product.name && (
          <p className="line-clamp-1 text-xs text-[var(--theme-muted)]">
            {product.subtitle}
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
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
