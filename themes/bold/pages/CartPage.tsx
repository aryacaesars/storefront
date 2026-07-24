import Link from "next/link"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { removeFromCart, updateQuantity } from "@/app/(storefront)/cart/actions"

export function CartPage({ config, cart = [] }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartBlocked = cart.some(
    (item) => item.variantUnavailable || item.needsVariantSelection,
  )
  const canProceedToCheckout = !cartBlocked

  return (
    <div className="bg-white min-h-screen">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1
          className="text-4xl font-black uppercase text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Your Cart
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{cart.length} item</p>

        {cart.length === 0 ? (
          <div className="mt-10 py-16 text-center">
            <p className="text-zinc-400 text-sm">Cart kamu kosong.</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-xs font-bold uppercase tracking-widest underline"
              style={{ color: "var(--theme-primary)" }}
            >
              Lihat Produk
            </Link>
          </div>
        ) : (
          <>
            {cart.some((item) => item.needsVariantSelection || item.variantUnavailable) && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Ada item cart yang tidak valid. Buka produk lalu pilih varian yang benar sebelum checkout.
              </div>
            )}
            <ul className="mt-10 divide-y divide-gray-100 border-y border-gray-100">
              {cart.map((item) => (
                <li key={item.lineKey} className="flex gap-5 py-6">
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-24 w-24 shrink-0 rounded-sm bg-gray-100 overflow-hidden"
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-zinc-200" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-lg font-black text-zinc-900 hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.needsVariantSelection && (
                        <p className="mt-2 text-xs text-yellow-700">⚠️ Produk memiliki varian baru — pilih varian di halaman produk.</p>
                      )}
                      {item.variantUnavailable && (
                        <p className="mt-2 text-xs text-red-600">⚠️ Varian ini sudah tidak tersedia. Hapus item lalu pilih ulang di halaman produk.</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <form action={updateQuantity.bind(null, item.lineKey, item.quantity - 1)}>
                          <button
                            type="submit"
                            aria-label="Kurangi jumlah"
                            className="flex h-7 w-7 items-center justify-center border border-zinc-200 text-sm text-zinc-500 transition-colors hover:border-zinc-400"
                          >
                            −
                          </button>
                        </form>
                        <span className="w-6 text-center text-sm font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <form action={updateQuantity.bind(null, item.lineKey, item.quantity + 1)}>
                          <button
                            type="submit"
                            aria-label="Tambah jumlah"
                            className="flex h-7 w-7 items-center justify-center border border-zinc-200 text-sm text-zinc-500 transition-colors hover:border-zinc-400"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
                        {formatIdr(item.price * item.quantity)}
                      </p>
                      <form action={removeFromCart.bind(null, item.lineKey)}>
                        <button
                          type="submit"
                          className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-end gap-4">
              <p className="text-lg font-black text-zinc-900">
                Subtotal: {formatIdr(subtotal)}
              </p>
              {canProceedToCheckout ? (
                <Link
                  href="/checkout"
                  className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--theme-accent)" }}
                >
                  Checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 opacity-40"
                  style={{ backgroundColor: "var(--theme-accent)" }}
                >
                  Checkout
                </button>
              )}
            </div>
          </>
        )}
      </section>
      <PerformanceFooter config={config} />
    </div>
  )
}
