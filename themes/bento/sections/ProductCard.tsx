import Link from "next/link"
import Image from "next/image"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"

interface ProductCardProps {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className={`h-full w-full ${product.imageClass} transition-transform duration-500 group-hover:scale-[1.04]`}
          />
        )}
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
            style={{
              backgroundColor:
                product.badge === "SALE" ? "#e07a5f" : "var(--theme-primary)",
            }}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="px-1">
        <p className="text-sm font-bold text-[#1a1c1b]">{product.name}</p>
        <p className="text-xs text-[#515160]">{product.subtitle}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--theme-primary)]">
            {formatIdr(displayPrice)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-[#515160] line-through">
              {formatIdr(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
