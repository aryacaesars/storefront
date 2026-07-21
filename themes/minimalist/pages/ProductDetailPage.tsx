import Link from "next/link"
import { mockProductToCatalog, TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import { ProductCard } from "@/themes/minimalist/sections/ProductCard"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { ProductNotFound } from "@/features/storefront/ProductNotFound"
import { resolveProductDetail } from "@/features/storefront/resolve-catalog-product"
import { ProductPurchaseActions } from "@/features/storefront/ProductPurchaseActions"
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

  const detailBody = (
    <div className="mt-8 grid gap-10 @3xl:grid-cols-2">
        {isLiveCatalog ? (
          <ProductVariantImage
            name={resolved.name}
            imageClass={resolved.imageClass}
            wrapperClassName="relative aspect-[3/4] overflow-hidden rounded-sm bg-gray-100"
            badge={
              resolved.badge ? (
                <span
                  className="absolute left-4 top-4 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase"
                  style={{
                    backgroundColor:
                      resolved.badge === "SALE" ? "#B45309" : "var(--theme-primary)",
                  }}
                >
                  {resolved.badge}
                </span>
              ) : undefined
            }
            overlay={
              !resolved.inStock ? (
                <span className="absolute right-4 top-4 bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
                  Habis
                </span>
              ) : undefined
            }
          />
        ) : (
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
            {!resolved.inStock && (
              <span className="absolute right-4 top-4 bg-black/70 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
                Habis
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col justify-center">
          <h1
            className="text-3xl font-semibold text-[var(--theme-text)] @2xl:text-4xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {resolved.name}
          </h1>
          {resolved.subtitle && (
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              {resolved.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3">
            {isLiveCatalog ? (
              <ProductVariantPrice className="text-2xl font-semibold text-[var(--theme-text)]" />
            ) : (
              <span className="text-2xl font-semibold text-[var(--theme-text)]">
                {formatIdr(displayPrice)}
              </span>
            )}
            {resolved.salePrice != null && (
              <span className="text-sm text-[var(--theme-muted)] line-through">
                {formatIdr(resolved.price)}
              </span>
            )}
          </div>
          {resolved.description && (
            <p className="mt-6 text-sm leading-relaxed text-[var(--theme-muted)]">
              {resolved.description}
            </p>
          )}
          {isLiveCatalog && resolved.inStock ? (
            <ProductPurchaseActions
              product={resolved}
              addLabel="Add to Cart"
              buyLabel="Beli"
              className="mt-8"
              buttonClassName="h-11 px-8 text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              secondaryButtonClassName="inline-flex h-11 items-center border border-[var(--theme-text)]/20 px-8 text-xs font-bold tracking-[0.14em] text-[var(--theme-text)] uppercase transition-colors hover:border-[var(--theme-text)] disabled:cursor-not-allowed disabled:opacity-50"
              buttonStyle={{ backgroundColor: "var(--theme-primary)" }}
            />
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="h-11 px-8 text-xs font-bold uppercase tracking-[0.14em] text-white opacity-50"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                {resolved.inStock ? "Add to Cart" : "Stok habis"}
              </button>
            </div>
          )}
          {isLiveCatalog && (
            <p className="mt-4 text-[10px] tracking-wide text-[var(--theme-muted)] uppercase">
              Data langsung dari katalog
            </p>
          )}
        </div>
    </div>
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

      {isLiveCatalog ? (
        <ProductVariantSelectionProvider product={resolved}>
          {detailBody}
        </ProductVariantSelectionProvider>
      ) : (
        detailBody
      )}

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
