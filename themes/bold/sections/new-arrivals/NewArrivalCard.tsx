import Image from "next/image"
import Link from "next/link"
import { formatIdr } from "@/features/storefront/catalog-types"
import type { CatalogProduct } from "@/features/storefront/catalog-types"

interface NewArrivalCardProps {
  product: CatalogProduct
}

export function NewArrivalCard({ product }: NewArrivalCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block cursor-pointer overflow-hidden border border-gray-100 bg-white transition-shadow hover:shadow-md"
    >
      <div className={`relative aspect-[4/5] overflow-hidden ${product.imageClass}`}>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white"
            style={{
              backgroundColor:
                product.badge === "SALE"
                  ? "var(--theme-accent)"
                  : "var(--theme-primary)",
            }}
          >
            {product.badge === "NEW" ? "NEW ARRIVAL" : product.badge}
          </span>
        )}
      </div>

      <div className="px-4 pb-5 pt-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          {product.subtitle}
        </p>
        <p
          className="mt-1 text-sm font-black uppercase leading-tight tracking-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {product.name}
        </p>
        <p className="mt-1.5 text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
          {formatIdr(product.salePrice ?? product.price)}
        </p>
      </div>
    </Link>
  )
}
