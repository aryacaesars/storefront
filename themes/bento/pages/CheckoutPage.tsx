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
    !cart.some((i) => i.needsVariantSelection)

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 @2xl:px-6 @2xl:py-10">
      {state && "error" in state && state.error && (
        <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="space-y-5">
        {/* User / shipping info — top card */}
        <div className="rounded-[27px] bg-white p-6 shadow-[0px_0px_19px_rgba(0,0,0,0.12)] @2xl:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                Pengiriman
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#1a1c1b]">Informasi pesanan</h2>
            </div>
            {checkoutCustomer && (
              <Link
                href="/account?tab=address"
                className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#1a1c1b] transition-colors hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
              >
                {checkoutAddress ? "Ubah alamat" : "Tambah alamat"}
              </Link>
            )}
          </div>

          {!checkoutCustomer ? (
            <div className="mt-5 rounded-2xl border border-dashed border-black/10 px-4 py-6 text-center">
              <p className="text-sm text-[#515160]">
                Masuk ke akun untuk memakai alamat tersimpan.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                <Link
                  href="/signin"
                  className="text-sm font-bold text-[var(--theme-primary)]"
                >
                  Masuk
                </Link>
                <Link href="/account" className="text-sm text-[#515160] hover:underline">
                  Atau ke Akun
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 @2xl:grid-cols-2">
              <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#515160]">
                  Penerima
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#1a1c1b]">
                  {checkoutCustomer.name || "—"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#515160]">
                  {checkoutCustomer.email}
                  {checkoutCustomer.phone ? (
                    <>
                      <br />
                      {checkoutCustomer.phone}
                    </>
                  ) : null}
                </p>
                <p className="mt-2 text-[11px] text-[#515160]">
                  Edit di{" "}
                  <Link href="/account" className="font-semibold text-[var(--theme-primary)]">
                    /account
                  </Link>
                </p>
              </div>

              {!checkoutAddress ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 px-4 py-5 text-center">
                  <p className="text-sm text-[#515160]">Belum ada alamat.</p>
                  <Link
                    href="/account?tab=address"
                    className="mt-2 text-sm font-bold text-[var(--theme-primary)]"
                  >
                    Tambah alamat
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#515160]">
                    Alamat pengiriman
                    {checkoutAddress.label ? ` · ${checkoutAddress.label}` : ""}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#1a1c1b]">
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

        {/* Order summary — below */}
        <div className="rounded-[27px] bg-white p-6 shadow-[0px_0px_19px_rgba(0,0,0,0.12)] @2xl:p-8">
          <h2 className="text-sm font-bold text-[#1a1c1b]">Order Summary</h2>
          <div className="mt-5">
            <CheckoutCartLines cart={cart} />
          </div>
          <div className="mt-5 flex justify-between border-t border-gray-100 pt-4 text-sm font-bold text-[#1a1c1b]">
            <span>Total</span>
            <span>{formatIdr(subtotal)}</span>
          </div>

          <form action={formAction}>
            <button
              type="submit"
              disabled={pending || !canPlaceOrder}
              className="mt-6 h-12 w-full rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              {pending ? "Memproses..." : "Place Order"}
            </button>
          </form>
          <Link
            href="/cart"
            className="mt-3 block text-center text-xs text-[#515160] hover:text-[var(--theme-primary)]"
          >
            Kembali ke cart
          </Link>
        </div>
      </div>
    </section>
  )
}
