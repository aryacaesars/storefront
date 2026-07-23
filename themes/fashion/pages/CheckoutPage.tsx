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
    Boolean(storeId)

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-5xl px-6 py-8">
        {state && "error" in state && state.error && (
          <p className="mb-5 text-sm text-red-600">{state.error}</p>
        )}

        <div className="space-y-6">
          <div className="border border-black/10 bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-medium text-[var(--theme-text)]">
                Informasi pesanan
              </h2>
              {checkoutCustomer && (
                <Link
                  href="/account?tab=address"
                  className="text-xs tracking-[0.1em] text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
                >
                  {checkoutAddress ? "Ubah alamat" : "Tambah alamat"}
                </Link>
              )}
            </div>

            {!checkoutCustomer ? (
              <div className="mt-5 text-center">
                <p className="text-sm text-[var(--theme-muted)]">Masuk untuk checkout.</p>
                <Link href="/signin" className="mt-2 inline-block text-sm text-[var(--theme-text)]">
                  Masuk
                </Link>
              </div>
            ) : !checkoutAddress ? (
              <div className="mt-5 text-center">
                <p className="text-sm text-[var(--theme-muted)]">Belum ada alamat.</p>
                <Link href="/account?tab=address" className="mt-2 inline-block text-sm text-[var(--theme-text)]">
                  Tambah alamat
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-3 text-sm text-[var(--theme-text)]">
                <p className="text-xs text-[var(--theme-muted)]">
                  {checkoutCustomer.name}
                  {checkoutCustomer.phone ? ` · ${checkoutCustomer.phone}` : ""}
                  {" · "}
                  {checkoutCustomer.email}
                </p>
                <p className="leading-relaxed">
                  {checkoutAddress.street}
                  <br />
                  {checkoutAddress.city}, {checkoutAddress.province}{" "}
                  {checkoutAddress.postalCode}
                </p>
              </div>
            )}
          </div>

          <aside className="border border-black/10 bg-white p-6">
            <p className="text-sm font-medium text-[var(--theme-text)]">Order summary</p>
            <div className="mt-5">
              <CheckoutCartLines cart={cart} />
            </div>
            <p className="mt-5 text-2xl font-medium text-[var(--theme-text)]">
              {formatIdr(subtotal)}
            </p>
            <form action={formAction}>
              <button
                type="submit"
                disabled={pending || !canPlaceOrder}
                className="mt-6 h-11 w-full bg-[var(--theme-text)] text-xs font-semibold uppercase tracking-[0.15em] text-white disabled:opacity-50"
              >
                {pending ? "Processing..." : "Complete Order"}
              </button>
            </form>
            <Link
              href="/cart"
              className="mt-3 block text-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
            >
              Return to bag
            </Link>
          </aside>
        </div>
      </section>
    </div>
  )
}
