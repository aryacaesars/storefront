"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { placeOrderAction } from "@/app/(storefront)/checkout/actions"
import type { CheckoutState } from "@/app/(storefront)/checkout/actions"
import { UseMyLocationButton } from "@/features/storefront/UseMyLocationButton"

const inputClass =
  "h-11 w-full border border-gray-200 px-4 text-sm text-[var(--theme-text)] outline-none transition-colors focus:border-[var(--theme-primary)] placeholder:text-[var(--theme-muted)]"

export function CheckoutPage({ cart = [], storeId, checkoutPrefill }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const action = storeId
    ? placeOrderAction.bind(null, storeId)
    : async (_prev: CheckoutState, _fd: FormData): Promise<CheckoutState> => ({ error: "Store tidak ditemukan." })

  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(action, undefined)

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      window.location.href = state.checkoutUrl
    }
  }, [state])

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Checkout
      </h1>
      {checkoutPrefill && (
        <p className="mt-2 text-sm text-[var(--theme-muted)]">
          Masuk sebagai <span className="font-semibold text-[var(--theme-text)]">{checkoutPrefill.email}</span>
        </p>
      )}
      {state && "error" in state && state.error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="mt-10 grid gap-10 @3xl:grid-cols-5">
        <form action={formAction} className="space-y-5 @3xl:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--theme-text)]">Contact</legend>
            <input name="name" type="text" required placeholder="Nama lengkap" defaultValue={checkoutPrefill?.name ?? ""} className={inputClass} />
            <input name="email" type="email" required placeholder="Email" defaultValue={checkoutPrefill?.email ?? ""} className={inputClass} />
            <input name="phone" type="tel" required placeholder="No. HP" defaultValue={checkoutPrefill?.phone ?? ""} className={inputClass} />
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--theme-text)]">Shipping Address</legend>
            <UseMyLocationButton className="text-xs font-bold uppercase tracking-[0.14em] underline transition-opacity hover:opacity-70 disabled:opacity-50" />
            <input name="street" type="text" required placeholder="Alamat" defaultValue={checkoutPrefill?.street ?? ""} className={inputClass} />
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input name="city" type="text" required placeholder="Kota" defaultValue={checkoutPrefill?.city ?? ""} className={inputClass} />
              <input name="province" type="text" required placeholder="Provinsi" defaultValue={checkoutPrefill?.province ?? ""} className={inputClass} />
            </div>
            <input name="postalCode" type="text" required placeholder="Kode pos" defaultValue={checkoutPrefill?.postalCode ?? ""} className={inputClass} />
          </fieldset>

          <aside className="rounded-lg p-6" style={{ backgroundColor: "var(--theme-accent)" }}>
            <h2 className="text-sm font-semibold text-[var(--theme-text)]">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.slug} className="flex justify-between text-[var(--theme-muted)]">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatIdr(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-black/5 pt-3 font-semibold text-[var(--theme-text)]">
                <span>Total</span>
                <span>{formatIdr(subtotal)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={pending || cart.length === 0}
              className="mt-6 h-11 w-full text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {pending ? "Memproses..." : "Place Order"}
            </button>
            <Link href="/cart" className="mt-3 block text-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
              Return to cart
            </Link>
          </aside>
        </form>
      </div>
    </section>
  )
}
