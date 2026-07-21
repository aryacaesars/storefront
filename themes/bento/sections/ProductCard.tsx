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
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--theme-accent,#f3f4f6)] ring-1 ring-black/[0.04]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className={`h-full w-full ${product.imageClass} transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{
              backgroundColor:
                product.badge === "SALE" ? "#e07a5f" : "var(--theme-primary)",
            }}
          >
            {product.badge}
          </span>
        )}

        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            Habis
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-0.5">
        <p
          className="line-clamp-2 text-sm font-semibold leading-snug text-[#1a1c1b] transition-colors group-hover:text-[var(--theme-primary)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {product.name}
        </p>
        {product.subtitle && product.subtitle !== product.name && (
          <p className="line-clamp-1 text-xs text-[#515160]">{product.subtitle}</p>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm font-bold text-[var(--theme-primary)]">
            {formatIdr(displayPrice)}
          </span>
          {product.salePrice != null && (
            <span className="text-xs text-[#515160] line-through">
              {formatIdr(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
