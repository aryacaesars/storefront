"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { placeOrderAction } from "@/app/(storefront)/checkout/actions"
import type { CheckoutState } from "@/app/(storefront)/checkout/actions"
import { UseMyLocationButton } from "@/features/storefront/UseMyLocationButton"

const inputClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#1a1c1b] outline-none transition-colors focus:border-[var(--theme-primary)] placeholder:text-[#515160]"

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
    <section className="mx-auto max-w-5xl px-4 py-12 @2xl:px-6">
      <div className="mb-10 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-3xl font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Checkout
        </h1>
        {state && "error" in state && state.error && (
          <p className="mt-3 text-sm text-red-600">{state.error}</p>
        )}
        {checkoutPrefill && (
          <p className="mt-2 text-sm text-[#515160]">
            Masuk sebagai <span className="font-semibold text-[#1a1c1b]">{checkoutPrefill.email}</span>
          </p>
        )}
      </div>

      <div className="grid gap-10 @3xl:grid-cols-5">
        <form action={formAction} className="space-y-4 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)] @3xl:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-[#1a1c1b]">Kontak</legend>
            <input name="email" type="email" required placeholder="Email" defaultValue={checkoutPrefill?.email ?? ""} className={inputClass} />
            <input name="name" type="text" required placeholder="Nama lengkap" defaultValue={checkoutPrefill?.name ?? ""} className={inputClass} />
            <input name="phone" type="tel" required placeholder="No. HP" defaultValue={checkoutPrefill?.phone ?? ""} className={inputClass} />
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-[#1a1c1b]">Alamat Pengiriman</legend>
            <UseMyLocationButton className="text-sm font-semibold text-[var(--theme-primary)] transition-opacity hover:opacity-70 disabled:opacity-50" />
            <input name="street" type="text" required placeholder="Alamat" defaultValue={checkoutPrefill?.street ?? ""} className={inputClass} />
            <div className="grid gap-3 @2xl:grid-cols-2">
              <input name="city" type="text" required placeholder="Kota" defaultValue={checkoutPrefill?.city ?? ""} className={inputClass} />
              <input name="province" type="text" required placeholder="Provinsi" defaultValue={checkoutPrefill?.province ?? ""} className={inputClass} />
            </div>
            <input name="postalCode" type="text" required placeholder="Kode pos" defaultValue={checkoutPrefill?.postalCode ?? ""} className={inputClass} />
          </fieldset>

          <aside className="rounded-[27px] border border-gray-100 bg-white p-6 shadow-[0px_0px_19px_rgba(0,0,0,0.08)]">
            <h2 className="text-sm font-bold text-[#1a1c1b]">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              {cart.map((item) => (
                <div key={item.slug} className="flex justify-between text-[#515160]">
                  <span>{item.name} ×{item.quantity}</span>
                  <span>{formatIdr(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-100 pt-3 font-bold text-[#1a1c1b]">
                <span>Total</span>
                <span>{formatIdr(subtotal)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={pending || cart.length === 0}
              className="mt-6 h-12 w-full rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {pending ? "Memproses..." : "Place Order"}
            </button>
            <Link href="/cart" className="mt-3 block text-center text-xs text-[#515160] hover:text-[var(--theme-primary)]">
              Kembali ke cart
            </Link>
          </aside>
        </form>
      </div>
    </section>
  )
}
