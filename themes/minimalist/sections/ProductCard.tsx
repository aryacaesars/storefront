import Link from "next/link"
import type { MockProduct } from "@/themes/minimalist/data/mock"

interface ProductCardProps {
  product: MockProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
        <div className={`h-full w-full ${product.imageClass} transition-transform duration-500 group-hover:scale-[1.02]`} />
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
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--theme-text)]">{product.name}</p>
        <p className="text-xs text-[var(--theme-muted)]">{product.subtitle}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--theme-text)]">
            ${displayPrice.toFixed(0)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-[var(--theme-muted)] line-through">
              ${product.price.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
