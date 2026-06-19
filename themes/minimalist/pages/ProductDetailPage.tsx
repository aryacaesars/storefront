import Link from "next/link"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"

export function ProductDetailPage({
  slug = "1",
  product,
  products = [],
}: ThemePageProps) {
  const mockFallback = TRENDING_PRODUCTS.find((item) => item.id === slug) ??
    TRENDING_PRODUCTS[0]

  const resolved =
    product ??
    (products.length === 0
      ? {
          ...mockProductToCatalog(mockFallback),
          description:
            "Cut from premium materials with a focus on longevity and quiet luxury.",
        }
      : null)

  if (!resolved) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[var(--theme-text)]">
          Produk tidak ditemukan
        </h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-[var(--theme-primary)] hover:underline"
        >
          Kembali ke daftar produk
        </Link>
      </section>
    )
  }

  const displayPrice = resolved.salePrice ?? resolved.price
  const related = (products.length > 0 ? products : []).filter(
    (item) => item.slug !== resolved.slug,
  )

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
        <Link href="/products" className="hover:text-[var(--theme-text)]">
          Products
        </Link>
        {" / "}
        {resolved.name}
      </p>

      <div className="mt-8 grid gap-10 @3xl:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
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
              className="absolute left-4 top-4 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase"
              style={{
                backgroundColor:
                  resolved.badge === "SALE" ? "#B45309" : "var(--theme-primary)",
              }}
            >
              {resolved.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1
            className="text-3xl font-semibold text-[var(--theme-text)] @2xl:text-4xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {resolved.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--theme-muted)]">
            {resolved.subtitle}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-semibold text-[var(--theme-text)]">
              {formatIdr(displayPrice)}
            </span>
            {resolved.salePrice != null && (
              <span className="text-sm text-[var(--theme-muted)] line-through">
                {formatIdr(resolved.price)}
              </span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[var(--theme-muted)]">
            {resolved.description ??
              "Cut from premium materials with a focus on longevity and quiet luxury."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="h-11 px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              Add to Cart
            </button>
            <Link
              href="/cart"
              className="inline-flex h-11 items-center border border-[var(--theme-text)]/20 px-8 text-xs font-bold tracking-[0.14em] text-[var(--theme-text)] uppercase transition-colors hover:border-[var(--theme-text)]"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 border-t border-black/5 pt-12">
          <h2
            className="mb-8 text-center text-xl font-semibold text-[var(--theme-text)]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            You May Also Like
          </h2>
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
