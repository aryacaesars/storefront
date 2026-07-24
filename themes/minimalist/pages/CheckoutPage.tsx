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
    Boolean(checkoutCustomer?.phone?.trim()) &&
    Boolean(checkoutAddress) &&
    cart.length > 0 &&
    Boolean(storeId) &&
    !cart.some((i) => i.needsVariantSelection || i.variantUnavailable)

  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      {state && "error" in state && state.error && (
        <p className="mb-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="space-y-6">
        <div className="border border-black/5 bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
                Shipping
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--theme-text)]">
                Informasi pesanan
              </h2>
            </div>
            {checkoutCustomer && (
              <Link
                href="/account?tab=address"
                className="border border-[var(--theme-text)]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--theme-text)]"
              >
                {checkoutAddress ? "Ubah alamat" : "Tambah alamat"}
              </Link>
            )}
          </div>

          {!checkoutCustomer ? (
            <div className="mt-5 border border-dashed border-black/10 px-4 py-6 text-center">
              <p className="text-sm text-[var(--theme-muted)]">
                Masuk ke akun untuk memakai alamat tersimpan.
              </p>
              <Link
                href="/signin"
                className="mt-3 inline-block text-sm font-semibold text-[var(--theme-primary)]"
              >
                Masuk
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 @2xl:grid-cols-2">
              <div className="bg-[var(--theme-bg)] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
                  Penerima
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[var(--theme-text)]">
                  {checkoutCustomer.name || "—"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted)]">
                  {checkoutCustomer.email}
                  {checkoutCustomer.phone ? (
                    <>
                      <br />
                      {checkoutCustomer.phone}
                    </>
                  ) : null}
                </p>
              </div>
              {!checkoutAddress ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-black/10 px-4 py-5 text-center">
                  <p className="text-sm text-[var(--theme-muted)]">Belum ada alamat.</p>
                  <Link
                    href="/account?tab=address"
                    className="mt-2 text-sm font-semibold text-[var(--theme-primary)]"
                  >
                    Tambah alamat
                  </Link>
                </div>
              ) : (
                <div className="bg-[var(--theme-bg)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
                    Alamat
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-text)]">
                    {checkoutAddress.street}
                    <br />
                    {checkoutAddress.city}, {checkoutAddress.province}{" "}
                    {checkoutAddress.postalCode}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="border border-black/5 bg-white p-6">
          <h2 className="text-sm font-semibold text-[var(--theme-text)]">Order Summary</h2>
          <div className="mt-5">
            <CheckoutCartLines cart={cart} />
          </div>
          <div className="mt-5 flex justify-between border-t border-black/5 pt-4 text-sm font-semibold text-[var(--theme-text)]">
            <span>Total</span>
            <span>{formatIdr(subtotal)}</span>
          </div>
          <form action={formAction}>
            <button
              type="submit"
              disabled={pending || !canPlaceOrder}
              className="mt-6 h-11 w-full text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {pending ? "Memproses..." : "Place Order"}
            </button>
          </form>
          <Link
            href="/cart"
            className="mt-3 block text-center text-xs text-[var(--theme-muted)] hover:text-[var(--theme-text)]"
          >
            Kembali ke cart
          </Link>
        </aside>
      </div>
    </section>
  )
}
