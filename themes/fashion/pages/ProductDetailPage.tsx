import Link from "next/link"
import { mockShopToCatalog, SHOP_PRODUCTS } from "@/themes/fashion/data/mock"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { ProductNotFound } from "@/features/storefront/ProductNotFound"
import { resolveProductDetail } from "@/features/storefront/resolve-catalog-product"
import {
  ProductVariantImage,
  ProductVariantPrice,
  ProductVariantSelectionProvider,
} from "@/features/storefront/ProductVariantSelection"
import { ProductPurchaseActions } from "@/features/storefront/ProductPurchaseActions"

const MOCK_CATALOG = SHOP_PRODUCTS.map(mockShopToCatalog)

export function ProductDetailPage({
  config = DEFAULT_FASHION_CONFIG,
  slug = "sp-1",
  product,
  products,
}: ThemePageProps) {
  const { product: resolved, isLiveCatalog } = resolveProductDetail(
    slug,
    product,
    products,
    MOCK_CATALOG,
  )

  if (!resolved) {
    return (
      <div style={{ backgroundColor: "var(--theme-bg)" }}>
        <ProductNotFound backHref="/products" />
        <ShopFooter config={config} />
      </div>
    )
  }

  const mockSource = SHOP_PRODUCTS.find((item) => item.id === slug)
  const priceLabel = isLiveCatalog
    ? formatIdr(resolved.salePrice ?? resolved.price)
    : `$${resolved.price.toFixed(0)}`

  const detailBody = (
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      {isLiveCatalog ? (
        <ProductVariantImage
          name={resolved.name}
          imageClass={resolved.imageClass}
          wrapperClassName="relative aspect-square overflow-hidden"
          badge={
            resolved.badge ? (
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-primary)] uppercase">
                {resolved.badge}
              </span>
            ) : undefined
          }
        />
      ) : (
        <div className="relative aspect-square overflow-hidden">
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
        </div>
      )}
      <div className="flex flex-col justify-center">
        {resolved.badge && (
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-primary)] uppercase">
            {resolved.badge}
          </span>
        )}
        <h1
          className="mt-2 text-3xl font-medium text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {resolved.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--theme-muted)]">
          {isLiveCatalog ? resolved.subtitle : mockSource?.category}
        </p>
        <p className="mt-6 text-2xl font-medium text-[var(--theme-text)]">
          {isLiveCatalog ? <ProductVariantPrice /> : priceLabel}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted)]">
          {resolved.description ??
            (mockSource
              ? `Materials: ${mockSource.material.join(", ")}. Crafted for the modern editorial wardrobe.`
              : "")}
        </p>
        {isLiveCatalog && resolved.inStock ? (
          <ProductPurchaseActions
            product={resolved}
            addLabel="Add to Bag"
            buyLabel="Beli Sekarang"
            className="mt-8"
            buttonClassName="h-11 w-full max-w-xs bg-[var(--theme-text)] text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          <button
            type="button"
            disabled={!resolved.inStock}
            className="mt-8 h-11 w-full max-w-xs bg-[var(--theme-text)] text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resolved.inStock ? "Add to Bag" : "Stok habis"}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
          <Link href="/products" className="hover:text-[var(--theme-text)]">
            Shop
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
      </section>
      <ShopFooter config={config} />
    </div>
  )
}
