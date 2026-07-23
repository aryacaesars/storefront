"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { placeOrderAction } from "@/app/(storefront)/checkout/actions"
import type { CheckoutState } from "@/app/(storefront)/checkout/actions"
import { CheckoutCartLines } from "@/features/storefront/CheckoutCartLines"

export function CheckoutPage({
  cart = [],
  storeId,
  checkoutCustomer,
  checkoutAddress,
}: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const action = storeId
    ? placeOrderAction.bind(null, storeId)
    : async (_prev: CheckoutState, _fd: FormData): Promise<CheckoutState> => ({
        error: "Store tidak ditemukan.",
      })

  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    action,
    undefined,
  )

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      window.location.href = state.checkoutUrl
    }
  }, [state])

  const canPlaceOrder =
    Boolean(checkoutCustomer?.name?.trim()) &&
    Boolean(checkoutAddress) &&
    cart.length > 0 &&
    Boolean(storeId) &&
    !cart.some((i) => i.needsVariantSelection)

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 py-8">
        {state && "error" in state && state.error && (
          <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {state.error}
          </p>
        )}

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Shipping
                </p>
                <h2 className="mt-1 text-lg font-black uppercase text-zinc-900">
                  Informasi pesanan
                </h2>
              </div>
              {checkoutCustomer && (
                <Link
                  href="/account?tab=address"
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-700"
                >
                  {checkoutAddress ? "Ubah alamat" : "Tambah alamat"}
                </Link>
              )}
            </div>

            {!checkoutCustomer ? (
              <div className="mt-5 rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center">
                <p className="text-sm text-zinc-500">Masuk ke akun untuk checkout.</p>
                <Link
                  href="/signin"
                  className="mt-3 inline-block text-sm font-bold uppercase tracking-wider"
                  style={{ color: "var(--theme-primary)" }}
                >
                  Masuk
                </Link>
              </div>
            ) : !checkoutAddress ? (
              <div className="mt-5 grid gap-3 @2xl:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                    Penerima
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-zinc-900">
                    {checkoutCustomer.name || "—"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {checkoutCustomer.email}
                    {checkoutCustomer.phone ? ` · ${checkoutCustomer.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center">
                  <p className="text-sm text-zinc-500">Belum ada alamat.</p>
                  <Link
                    href="/account?tab=address"
                    className="mt-2 text-sm font-bold uppercase tracking-wider"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    Tambah alamat
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 @2xl:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                    Penerima
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-zinc-900">
                    {checkoutCustomer.name || "—"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {checkoutCustomer.email}
                    {checkoutCustomer.phone ? ` · ${checkoutCustomer.phone}` : ""}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                    Alamat
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-900">
                    {checkoutAddress.street}
                    <br />
                    {checkoutAddress.city}, {checkoutAddress.province}{" "}
                    {checkoutAddress.postalCode}
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900">
              Order Summary
            </h2>
            <div className="mt-5">
              <CheckoutCartLines cart={cart} />
            </div>
            <div className="mt-5 flex justify-between border-t border-zinc-100 pt-4 text-sm font-black text-zinc-900">
              <span>Total</span>
              <span>{formatIdr(subtotal)}</span>
            </div>
            <form action={formAction}>
              <button
                type="submit"
                disabled={pending || !canPlaceOrder}
                className="mt-6 h-12 w-full rounded-full text-xs font-black uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                {pending ? "Processing..." : "Place Order"}
              </button>
            </form>
            <Link
              href="/cart"
              className="mt-3 block text-center text-xs text-zinc-500 hover:text-zinc-900"
            >
              Back to cart
            </Link>
          </aside>
        </div>
      </section>
    </div>
  )
}
