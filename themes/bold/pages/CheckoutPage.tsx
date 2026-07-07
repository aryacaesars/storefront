"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { placeOrderAction } from "@/app/(storefront)/checkout/actions"
import type { CheckoutState } from "@/app/(storefront)/checkout/actions"
import { UseMyLocationButton } from "@/features/storefront/UseMyLocationButton"

export function CheckoutPage({ config, cart = [], storeId, checkoutPrefill }: ThemePageProps) {
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
    <div className="bg-white min-h-screen">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1
          className="text-4xl font-black uppercase text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Secure Checkout
        </h1>

        {state && "error" in state && state.error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
        )}

        {checkoutPrefill && (
          <p className="mt-2 text-sm text-zinc-500">
            Masuk sebagai <span className="font-semibold text-zinc-900">{checkoutPrefill.email}</span>
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <form action={formAction} className="space-y-4 lg:col-span-3">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              defaultValue={checkoutPrefill?.email ?? ""}
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <input
              name="name"
              type="text"
              required
              placeholder="Nama lengkap"
              defaultValue={checkoutPrefill?.name ?? ""}
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <input
              name="phone"
              type="tel"
              required
              placeholder="No. HP"
              defaultValue={checkoutPrefill?.phone ?? ""}
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <UseMyLocationButton className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-900 underline transition-opacity hover:opacity-70 disabled:opacity-50" />
            <input
              name="street"
              type="text"
              required
              placeholder="Alamat pengiriman"
              defaultValue={checkoutPrefill?.street ?? ""}
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                type="text"
                required
                placeholder="Kota"
                defaultValue={checkoutPrefill?.city ?? ""}
                className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
              />
              <input
                name="province"
                type="text"
                required
                placeholder="Provinsi"
                defaultValue={checkoutPrefill?.province ?? ""}
                className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <input
              name="postalCode"
              type="text"
              required
              placeholder="Kode pos"
              defaultValue={checkoutPrefill?.postalCode ?? ""}
              className="h-12 w-full border border-gray-200 px-4 text-sm outline-none focus:border-zinc-900"
            />

            <aside className="rounded-sm bg-zinc-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-white/50">
                Order Total
              </p>
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {cart.map((item) => (
                  <li key={item.slug} className="flex justify-between">
                    <span>{item.name} ×{item.quantity}</span>
                    <span>{formatIdr(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-white/10 pt-3 text-3xl font-black">
                {formatIdr(subtotal)}
              </p>
              <button
                type="submit"
                disabled={pending || cart.length === 0}
                className="mt-6 h-12 w-full text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                {pending ? "Memproses..." : "Place Order"}
              </button>
              <Link href="/cart" className="mt-3 block text-center text-xs text-white/50 hover:text-white">
                Kembali ke cart
              </Link>
            </aside>
          </form>
        </div>
      </section>
      <PerformanceFooter config={config} />
    </div>
  )
}
