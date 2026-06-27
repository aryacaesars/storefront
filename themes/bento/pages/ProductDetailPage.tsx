import Link from "next/link"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import { ProductCard } from "@/themes/bento/sections/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { ProductNotFound } from "@/features/storefront/ProductNotFound"
import { resolveProductDetail } from "@/features/storefront/resolve-catalog-product"

const MOCK_CATALOG = TRENDING_PRODUCTS.map(mockProductToCatalog)

export function ProductDetailPage({
  slug = "1",
  product,
  products = [],
}: ThemePageProps) {
  const { product: resolved, related, isLiveCatalog } = resolveProductDetail(
    slug,
    product,
    products,
    MOCK_CATALOG,
  )

  if (!resolved) {
    return <ProductNotFound />
  }

  const displayPrice = resolved.salePrice ?? resolved.price

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#515160]">
        <Link href="/products" className="hover:text-[var(--theme-primary)]">
          Products
        </Link>
        {" / "}
        {resolved.name}
      </p>

      <div className="mt-8 grid gap-10 @3xl:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[27px] bg-white shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
          {resolved.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolved.imageUrl}
              alt={resolved.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full ${resolved.imageClass}`} />
          )}
          {resolved.badge && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
              style={{
                backgroundColor:
                  resolved.badge === "SALE" ? "#e07a5f" : "var(--theme-primary)",
              }}
            >
              {resolved.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1
            className="text-3xl font-bold text-[#1a1c1b] @2xl:text-4xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {resolved.name}
          </h1>
          {resolved.subtitle && (
            <p className="mt-2 text-sm text-[#515160]">{resolved.subtitle}</p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-bold text-[var(--theme-primary)]">
              {formatIdr(displayPrice)}
            </span>
            {resolved.salePrice != null && (
              <span className="text-sm text-[#515160] line-through">
                {formatIdr(resolved.price)}
              </span>
            )}
          </div>
          {resolved.description && (
            <p className="mt-6 text-sm leading-relaxed text-[#515160]">
              {resolved.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!resolved.inStock}
              className="h-12 rounded-full px-8 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {resolved.inStock ? "Add to Cart" : "Stok habis"}
            </button>
            <Link
              href="/cart"
              className="inline-flex h-12 items-center rounded-full border border-gray-200 px-8 text-sm font-semibold text-[#1a1c1b] transition-colors hover:border-[var(--theme-primary)]"
            >
              View Cart
            </Link>
          </div>
          {isLiveCatalog && (
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#515160]">
              Katalog Scalev
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2
              className="text-2xl font-bold capitalize leading-none text-[#1a1c1b] @2xl:text-3xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              You May Also Like
            </h2>
            <span
              className="h-1.5 w-16 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--theme-primary)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
