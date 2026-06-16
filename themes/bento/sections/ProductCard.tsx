import Link from "next/link"
import type { MockProduct } from "@/themes/bento/data/mock"

interface ProductCardProps {
  product: MockProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-white shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <div
          className={`h-full w-full ${product.imageClass} transition-transform duration-500 group-hover:scale-[1.04]`}
        />
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
            ${displayPrice.toFixed(0)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-[#515160] line-through">
              ${product.price.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
