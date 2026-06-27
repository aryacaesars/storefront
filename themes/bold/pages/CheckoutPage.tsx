import Link from "next/link"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function CheckoutPage({ config }: ThemePageProps) {
  return (
    <div className="bg-white min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1
          className="text-4xl font-black uppercase text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Secure Checkout
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Demo checkout — no payment processed.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <form className="space-y-6 lg:col-span-3">
            <input
              type="email"
              placeholder="Email"
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <input
              type="text"
              placeholder="Full name"
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <input
              type="text"
              placeholder="Shipping address"
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
          </form>
          <aside className="rounded-sm bg-zinc-950 p-6 text-white lg:col-span-2">
            <p className="text-xs font-black uppercase tracking-widest text-white/50">
              Order Total
            </p>
            <p className="mt-2 text-3xl font-black">$255.00</p>
            <button
              type="button"
              className="mt-6 h-12 w-full text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              Place Order
            </button>
            <Link href="/cart" className="mt-3 block text-center text-xs text-white/50 hover:text-white">
              Back to cart
            </Link>
          </aside>
        </div>
      </section>
      <PerformanceFooter config={config} />
    </div>
  )
}
