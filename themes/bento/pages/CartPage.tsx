import Link from "next/link"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { removeFromCart, updateQuantity } from "@/app/(storefront)/cart/actions"

export function CartPage({ cart = [] }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const canProceedToCheckout = !cart.some((item) => item.needsVariantSelection || item.variantUnavailable)

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 @2xl:px-6">
      <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <h1
          className="text-3xl font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Your Cart
        </h1>
        <p className="mt-2 text-sm text-[#515160]">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>

        {cart.length === 0 ? (
          <div className="mt-10 py-12 text-center">
            <p className="text-[#515160] text-sm">Cart kamu kosong.</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm font-bold"
              style={{ color: "var(--theme-primary)" }}
            >
              Lihat Produk
            </Link>
          </div>
        ) : (
          <>
            {cart.some((item) => item.needsVariantSelection || item.variantUnavailable) && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Ada item cart yang tidak valid. Silakan buka produk dan pilih varian yang benar sebelum checkout.
              </div>
            )}
            <ul className="mt-10 space-y-4">
              {cart.map((item) => (
                <li key={item.lineKey} className="flex gap-5 rounded-2xl border border-gray-100 p-4">
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-24 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100"
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-bold text-[#1a1c1b] hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.needsVariantSelection && (
                        <p className="mt-2 text-xs text-yellow-700">⚠️ Produk memiliki varian baru — pilih varian di halaman produk.</p>
                      )}
                      {item.priceMismatch && item.currentPrice !== undefined && (
                        <p className="mt-2 text-xs text-yellow-700">⚠️ Harga berubah: sekarang {formatIdr(item.currentPrice)}. Periksa pilihan varian.</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <form action={updateQuantity.bind(null, item.lineKey, item.quantity - 1)}>
                          <button
                            type="submit"
                            aria-label="Kurangi jumlah"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-sm text-[#515160] transition-colors hover:border-gray-400"
                          >
                            −
                          </button>
                        </form>
                        <span className="w-6 text-center text-sm font-semibold text-[#1a1c1b]">
                          {item.quantity}
                        </span>
                        <form action={updateQuantity.bind(null, item.lineKey, item.quantity + 1)}>
                          <button
                            type="submit"
                            aria-label="Tambah jumlah"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-sm text-[#515160] transition-colors hover:border-gray-400"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
                        {formatIdr(item.price * item.quantity)}
                      </p>
                      <form action={removeFromCart.bind(null, item.lineKey)}>
                        <button type="submit" className="text-xs text-[#515160] hover:text-red-500 transition-colors">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-end gap-4">
              <div className="flex w-full max-w-xs justify-between text-sm">
                <span className="text-[#515160]">Subtotal</span>
                <span className="font-bold text-[#1a1c1b]">{formatIdr(subtotal)}</span>
              </div>
              {canProceedToCheckout ? (
                <Link
                  href="/checkout"
                  className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full text-sm font-bold text-white opacity-40"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
