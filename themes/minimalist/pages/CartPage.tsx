import Link from "next/link"
import { TRENDING_PRODUCTS } from "@/themes/minimalist/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

const CART_ITEMS = TRENDING_PRODUCTS.slice(0, 2)

export function CartPage({ config: _config }: ThemePageProps) {
  const subtotal = CART_ITEMS.reduce(
    (sum, item) => sum + (item.salePrice ?? item.price),
    0,
  )

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-[var(--theme-muted)]">
        {CART_ITEMS.length} item{CART_ITEMS.length !== 1 ? "s" : ""}
      </p>

      <ul className="mt-10 divide-y divide-black/5 border-y border-black/5">
        {CART_ITEMS.map((item) => (
          <li key={item.id} className="flex gap-5 py-6">
            <div className={`h-24 w-20 shrink-0 rounded-sm ${item.imageClass}`} />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--theme-text)]">{item.name}</p>
                <p className="text-xs text-[var(--theme-muted)]">{item.subtitle}</p>
              </div>
              <p className="text-sm font-semibold text-[var(--theme-text)]">
                ${(item.salePrice ?? item.price).toFixed(0)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full max-w-xs justify-between text-sm">
          <span className="text-[var(--theme-muted)]">Subtotal</span>
          <span className="font-semibold text-[var(--theme-text)]">
            ${subtotal.toFixed(0)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="inline-flex h-11 w-full max-w-xs items-center justify-center text-xs font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </section>
  )
}
