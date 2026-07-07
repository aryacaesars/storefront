import Link from "next/link"
import { SHOP_PRODUCTS } from "@/themes/fashion/data/mock"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"

const CART_ITEMS = SHOP_PRODUCTS.slice(0, 2)

export function CartPage({ config = DEFAULT_FASHION_CONFIG }: ThemePageProps) {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price, 0)

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1
          className="text-3xl font-medium text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Shopping Bag
        </h1>
        <ul className="mt-10 divide-y divide-black/5">
          {CART_ITEMS.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <div className={`h-28 w-20 shrink-0 ${item.imageClass}`} />
              <div className="flex flex-1 flex-col justify-between">
                <p className="text-sm font-medium text-[var(--theme-text)]">{item.name}</p>
                <p className="text-sm text-[var(--theme-text)]">${item.price.toFixed(0)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 border-t border-black/5 pt-6 text-right">
          <p className="text-lg font-medium text-[var(--theme-text)]">
            Subtotal ${subtotal.toFixed(0)}
          </p>
          <Link
            href="/checkout"
            className="mt-4 inline-flex h-11 items-center bg-[var(--theme-text)] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white"
          >
            Checkout
          </Link>
        </div>
      </section>
      <ShopFooter config={config} />
    </div>
  )
}
