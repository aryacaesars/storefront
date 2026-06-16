import Link from "next/link"
import { SHOP_PRODUCTS } from "@/themes/fashion/data/mock"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function ProductDetailPage({
  config = DEFAULT_FASHION_CONFIG,
  slug = "sp-1",
}: ThemePageProps) {
  const product = SHOP_PRODUCTS.find((item) => item.id === slug) ?? SHOP_PRODUCTS[0]

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-muted)] uppercase">
          <Link href="/shop" className="hover:text-[var(--theme-text)]">
            Shop
          </Link>
          {" / "}
          {product.name}
        </p>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className={`aspect-[3/4] ${product.imageClass}`} />
          <div className="flex flex-col justify-center">
            {product.badge && (
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--theme-primary)] uppercase">
                {product.badge}
              </span>
            )}
            <h1
              className="mt-2 text-3xl font-medium text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">{product.category}</p>
            <p className="mt-6 text-2xl font-medium text-[var(--theme-text)]">
              ${product.price.toFixed(0)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--theme-muted)]">
              Materials: {product.material.join(", ")}. Crafted for the modern editorial wardrobe.
            </p>
            <button
              type="button"
              className="mt-8 h-11 w-full max-w-xs bg-[var(--theme-text)] text-xs font-semibold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </section>
      <ShopFooter config={config} />
    </div>
  )
}
