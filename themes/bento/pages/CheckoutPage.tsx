import Link from "next/link"
import type { ThemePageProps } from "@/themes/engine/page-props"

const inputClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#1a1c1b] outline-none transition-colors focus:border-[var(--theme-primary)] placeholder:text-[#515160]"

export function CheckoutPage({ config: _config }: ThemePageProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 @2xl:px-6">
      <div className="mb-10 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-3xl font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Checkout
        </h1>
        <p className="mt-2 text-sm text-[#515160]">
          Secure checkout — demo mode, no payment processed.
        </p>
      </div>

      <div className="grid gap-10 @3xl:grid-cols-5">
        <form className="space-y-6 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)] @3xl:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-[#1a1c1b]">Contact</legend>
            <input type="email" placeholder="Email" className={inputClass} />
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-[#1a1c1b]">
              Shipping Address
            </legend>
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input type="text" placeholder="First name" className={inputClass} />
              <input type="text" placeholder="Last name" className={inputClass} />
            </div>
            <input type="text" placeholder="Address" className={inputClass} />
            <input type="text" placeholder="City" className={inputClass} />
          </fieldset>
        </form>

        <aside className="rounded-[27px] border border-gray-100 bg-white p-6 shadow-[0px_0px_19px_rgba(0,0,0,0.08)] @3xl:col-span-2">
          <h2 className="text-sm font-bold text-[#1a1c1b]">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#515160]">
              <span>Subtotal</span>
              <span>$437</span>
            </div>
            <div className="flex justify-between text-[#515160]">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-[#1a1c1b]">
              <span>Total</span>
              <span>$437</span>
            </div>
          </div>
          <button
            type="button"
            className="mt-6 h-12 w-full rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            Place Order
          </button>
          <Link
            href="/cart"
            className="mt-3 block text-center text-xs text-[#515160] hover:text-[var(--theme-primary)]"
          >
            Return to cart
          </Link>
        </aside>
      </div>
    </section>
  )
}
