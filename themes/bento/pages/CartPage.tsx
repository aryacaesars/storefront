import Link from "next/link"
import { TRENDING_PRODUCTS } from "@/themes/bento/data/mock"
import type { ThemePageProps } from "@/themes/engine/page-props"

const CART_ITEMS = TRENDING_PRODUCTS.slice(0, 2)

export function CartPage({ config: _config }: ThemePageProps) {
  const subtotal = CART_ITEMS.reduce(
    (sum, item) => sum + (item.salePrice ?? item.price),
    0,
  )

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 @2xl:px-6">
      <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-3xl font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Your Cart
        </h1>
        <p className="mt-2 text-sm text-[#515160]">
          {CART_ITEMS.length} item{CART_ITEMS.length !== 1 ? "s" : ""}
        </p>

        <ul className="mt-10 space-y-4">
          {CART_ITEMS.map((item) => (
            <li key={item.id} className="flex gap-5 rounded-2xl border border-gray-100 p-4">
              <div className={`h-24 w-20 shrink-0 rounded-xl ${item.imageClass}`} />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1a1c1b]">{item.name}</p>
                  <p className="text-xs text-[#515160]">{item.subtitle}</p>
                </div>
                <p className="text-sm font-bold text-[var(--theme-primary)]">
                  ${(item.salePrice ?? item.price).toFixed(0)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-end gap-4">
          <div className="flex w-full max-w-xs justify-between text-sm">
            <span className="text-[#515160]">Subtotal</span>
            <span className="font-bold text-[#1a1c1b]">
              ${subtotal.toFixed(0)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </section>
  )
}
