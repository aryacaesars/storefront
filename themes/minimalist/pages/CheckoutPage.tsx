import Link from "next/link"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function CheckoutPage({ config: _config }: ThemePageProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Checkout
      </h1>
      <p className="mt-2 text-sm text-[var(--theme-muted)]">
        Secure checkout — demo mode, no payment processed.
      </p>

      <div className="mt-10 grid gap-10 @3xl:grid-cols-5">
        <form className="@3xl:col-span-3 space-y-5">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--theme-text)]">
              Contact
            </legend>
            <input
              type="email"
              placeholder="Email"
              className="h-11 w-full border border-gray-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
            />
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--theme-text)]">
              Shipping Address
            </legend>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input
                type="text"
                placeholder="First name"
                className="h-11 border border-gray-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
              />
              <input
                type="text"
                placeholder="Last name"
                className="h-11 border border-gray-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              className="h-11 w-full border border-gray-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
            />
            <input
              type="text"
              placeholder="City"
              className="h-11 w-full border border-gray-200 px-4 text-sm outline-none focus:border-[var(--theme-primary)]"
            />
          </fieldset>
        </form>

        <aside
          className="@3xl:col-span-2 rounded-lg p-6"
          style={{ backgroundColor: "var(--theme-accent)" }}
        >
          <h2 className="text-sm font-semibold text-[var(--theme-text)]">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[var(--theme-muted)]">
              <span>Subtotal</span>
              <span>$371</span>
            </div>
            <div className="flex justify-between text-[var(--theme-muted)]">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-3 font-semibold text-[var(--theme-text)]">
              <span>Total</span>
              <span>$371</span>
            </div>
          </div>
          <button
            type="button"
            className="mt-6 h-11 w-full text-xs font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            Place Order
          </button>
          <Link
            href="/cart"
            className="mt-3 block text-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
          >
            Return to cart
          </Link>
        </aside>
      </div>
    </section>
  )
}
