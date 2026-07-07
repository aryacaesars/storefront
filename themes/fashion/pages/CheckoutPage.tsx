import Link from "next/link"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function CheckoutPage({ config = DEFAULT_FASHION_CONFIG }: ThemePageProps) {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1
          className="text-3xl font-medium text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Checkout
        </h1>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">Demo — no payment processed.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="h-11 w-full border border-black/10 px-4 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Full name"
              className="h-11 w-full border border-black/10 px-4 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              className="h-11 w-full border border-black/10 px-4 text-sm outline-none"
            />
          </form>
          <aside className="border border-black/10 p-6">
            <p className="text-sm font-medium text-[var(--theme-text)]">Order summary</p>
            <p className="mt-4 text-2xl font-medium text-[var(--theme-text)]">$1,270</p>
            <button
              type="button"
              className="mt-6 h-11 w-full bg-[var(--theme-text)] text-xs font-semibold uppercase tracking-[0.15em] text-white"
            >
              Complete Order
            </button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
            >
              Return to bag
            </Link>
          </aside>
        </div>
      </section>
      <ShopFooter config={config} />
    </div>
  )
}
