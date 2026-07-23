import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import { RELATED_PRODUCTS } from "@/themes/bold/data/mock"

interface RelatedProductsProps {
  products?: CatalogProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const useLive = products != null

  // Live tanpa produk terkait — sembunyikan section, jangan tampilkan mock.
  if (useLive && products.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--theme-primary)" }}
          >
            COMPLETE THE KIT
          </p>
          <h2
            className="mt-1 text-2xl font-black uppercase text-zinc-900"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            YOU MAY ALSO LIKE
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-gray-200 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {useLive
          ? products!.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                ) : (
                  <div className={`aspect-square overflow-hidden rounded-sm ${p.imageClass}`} />
                )}
                <p
                  className="mt-3 text-sm font-black uppercase text-zinc-900 group-hover:underline"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  {p.name}
                </p>
                <p className="mt-1 text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
                  {formatIdr(p.salePrice ?? p.price)}
                </p>
              </Link>
            ))
          : RELATED_PRODUCTS.map((p) => (
              <div key={p.id} className="cursor-pointer">
                <div className={`aspect-square overflow-hidden rounded-sm ${p.imageClass}`} />
                <p
                  className="mt-3 text-sm font-black uppercase text-zinc-900"
                  style={{ fontFamily: "var(--theme-heading-font)" }}
                >
                  {p.name}
                </p>
                <p className="mt-1 text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
                  ${p.price.toFixed(2)}
                </p>
              </div>
            ))}
      </div>
    </div>
  )
}
