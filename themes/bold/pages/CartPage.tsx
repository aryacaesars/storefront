import Link from "next/link"
import { PRODUCTS } from "@/themes/bold/data/mock"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"

const CART_ITEMS = PRODUCTS.slice(0, 2)

export function CartPage({ config }: ThemePageProps) {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h1
          className="text-4xl font-black uppercase text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Your Cart
        </h1>
        <ul className="mt-10 divide-y divide-gray-100 border-y border-gray-100">
          {CART_ITEMS.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <div className={`h-24 w-24 shrink-0 rounded-sm ${item.imageClass}`} />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    {item.category}
                  </p>
                  <p className="mt-1 text-lg font-black text-zinc-900">{item.name}</p>
                </div>
                <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-end gap-4">
          <p className="text-lg font-black text-zinc-900">
            Subtotal: ${subtotal.toFixed(2)}
          </p>
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            Checkout
          </Link>
        </div>
      </section>
      <PerformanceFooter config={config} />
    </>
  )
}
