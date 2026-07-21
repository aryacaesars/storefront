import Link from "next/link"
import Image from "next/image"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import { ProductCard } from "@/themes/bento/sections/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { resolveProductDetail } from "@/features/storefront/resolve-catalog-product"
import { ProductPurchaseActions } from "@/features/storefront/ProductPurchaseActions"
import { ProductNotFound } from "@/features/storefront/ProductNotFound"
import {
  ProductVariantImage,
  ProductVariantPrice,
  ProductVariantSelectionProvider,
} from "@/features/storefront/ProductVariantSelection"

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
  const priceLabel =
    resolved.priceMax != null && resolved.priceMax > resolved.price
      ? `${formatIdr(resolved.price)} – ${formatIdr(resolved.priceMax)}`
      : formatIdr(displayPrice)
  const outOfStock = resolved.inStock === false
  const subtitle =
    resolved.subtitle && resolved.subtitle !== resolved.name
      ? resolved.subtitle
      : null
  const description =
    resolved.description && resolved.description !== resolved.subtitle
      ? resolved.description
      : resolved.description && !subtitle
        ? resolved.description
        : null

  const detailBody = (
    <div className="mt-8 grid items-start gap-10 @3xl:grid-cols-2 @3xl:gap-14">
      {isLiveCatalog ? (
        <ProductVariantImage
          name={resolved.name}
          imageClass={resolved.imageClass}
          wrapperClassName="relative aspect-square overflow-hidden rounded-3xl bg-[var(--theme-accent,#f3f4f6)] ring-1 ring-black/[0.04]"
          badge={
            resolved.badge ? (
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{
                  backgroundColor:
                    resolved.badge === "SALE" ? "#e07a5f" : "var(--theme-primary)",
                }}
              >
                {resolved.badge}
              </span>
            ) : undefined
          }
          overlay={
            outOfStock ? (
              <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Habis
              </span>
            ) : undefined
          }
        />
      ) : (
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[var(--theme-accent,#f3f4f6)] ring-1 ring-black/[0.04]">
          {resolved.imageUrl ? (
            <Image
              src={resolved.imageUrl}
              alt={resolved.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className={`h-full w-full ${resolved.imageClass}`} />
          )}
          {resolved.badge && (
            <span
              className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{
                backgroundColor:
                  resolved.badge === "SALE" ? "#e07a5f" : "var(--theme-primary)",
              }}
            >
              {resolved.badge}
            </span>
          )}
          {outOfStock && (
            <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Habis
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col @3xl:sticky @3xl:top-24">
        <h1
          className="text-3xl font-bold tracking-tight text-[#1a1c1b] @2xl:text-4xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {resolved.name}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-[#515160]">{subtitle}</p>
        )}

        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          {isLiveCatalog ? (
            <ProductVariantPrice className="text-3xl font-bold text-[var(--theme-primary)]" />
          ) : (
            <span className="text-3xl font-bold text-[var(--theme-primary)]">
              {priceLabel}
            </span>
          )}
          {resolved.salePrice != null && (
            <span className="text-base text-[#515160] line-through">
              {formatIdr(resolved.price)}
            </span>
          )}
        </div>

        <p
          className={`mt-3 text-xs font-semibold uppercase tracking-wider ${
            outOfStock ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {outOfStock ? "Stok habis" : "Tersedia"}
        </p>

        {description && (
          <div className="mt-8 border-t border-black/[0.06] pt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#515160]">
              Deskripsi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#515160]">
              {description}
            </p>
          </div>
        )}

        {isLiveCatalog && resolved.inStock ? (
          <ProductPurchaseActions
            product={resolved}
            addLabel="Add to Cart"
            buyLabel="Beli"
            className="mt-10"
            buttonClassName="h-12 min-w-[160px] rounded-full px-8 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            secondaryButtonClassName="inline-flex h-12 items-center rounded-full border border-black/10 px-8 text-sm font-semibold text-[#1a1c1b] transition-colors hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            buttonStyle={{ backgroundColor: "var(--theme-primary)" }}
          />
        ) : (
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="h-12 cursor-not-allowed rounded-full px-8 text-sm font-bold text-white opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {outOfStock ? "Stok habis" : "Add to Cart"}
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 @2xl:px-6 @2xl:py-14">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#515160]"
      >
        <Link href="/" className="transition-colors hover:text-[var(--theme-primary)]">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link
          href="/products"
          className="transition-colors hover:text-[var(--theme-primary)]"
        >
          Products
        </Link>
        <span aria-hidden>/</span>
        <span className="line-clamp-1 text-[#1a1c1b]">{resolved.name}</span>
      </nav>

      {isLiveCatalog ? (
        <ProductVariantSelectionProvider product={resolved}>
          {detailBody}
        </ProductVariantSelectionProvider>
      ) : (
        detailBody
      )}

      {related.length > 0 && (
        <div className="mt-20 border-t border-black/[0.06] pt-16">
          <div className="mb-8 flex flex-col gap-4 @2xl:flex-row @2xl:items-end @2xl:justify-between">
            <h2
              className="text-2xl font-bold capitalize leading-none text-[#1a1c1b] @2xl:text-3xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              You May Also Like
            </h2>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)] transition-opacity hover:opacity-80"
            >
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 @3xl:grid-cols-4 @3xl:gap-6">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
