import Link from "next/link"
import { ShopFooter } from "@/themes/fashion/sections/shop/ShopFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { removeFromCart, updateQuantity } from "@/app/(storefront)/cart/actions"

export function CartPage({ config = DEFAULT_FASHION_CONFIG, cart = [] }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const canProceedToCheckout = !cart.some((item) => item.needsVariantSelection || item.variantUnavailable)

  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1
          className="text-3xl font-medium text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Shopping Bag
        </h1>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </p>

        {cart.length === 0 ? (
          <div className="mt-10 py-16 text-center">
            <p className="text-sm text-[var(--theme-muted)]">Cart kamu kosong.</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[var(--theme-text)] underline"
            >
              Lihat Produk
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
            <ul className="mt-10 divide-y divide-black/5">
              {cart.map((item) => (
                <li key={item.lineKey} className="flex gap-5 py-6">
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-28 w-20 shrink-0 overflow-hidden bg-gray-100"
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
                        className="text-sm font-medium text-[var(--theme-text)] hover:underline"
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
                            className="flex h-7 w-7 items-center justify-center border border-black/10 text-sm text-[var(--theme-muted)] transition-colors hover:border-black/30"
                          >
                            −
                          </button>
                        </form>
                        <span className="w-6 text-center text-sm font-medium text-[var(--theme-text)]">
                          {item.quantity}
                        </span>
                        <form action={updateQuantity.bind(null, item.lineKey, item.quantity + 1)}>
                          <button
                            type="submit"
                            aria-label="Tambah jumlah"
                            className="flex h-7 w-7 items-center justify-center border border-black/10 text-sm text-[var(--theme-muted)] transition-colors hover:border-black/30"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[var(--theme-text)]">
                        {formatIdr(item.price * item.quantity)}
                      </p>
                      <form action={removeFromCart.bind(null, item.lineKey)}>
                        <button
                          type="submit"
                          className="text-xs text-[var(--theme-muted)] transition-colors hover:text-red-500"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-black/5 pt-6 text-right">
              <p className="text-lg font-medium text-[var(--theme-text)]">
                Subtotal {formatIdr(subtotal)}
              </p>
              {canProceedToCheckout ? (
                <Link
                  href="/checkout"
                  className="mt-4 inline-flex h-11 items-center bg-[var(--theme-text)] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white"
                >
                  Checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-4 inline-flex h-11 items-center bg-[var(--theme-text)] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white opacity-40"
                >
                  Checkout
                </button>
              )}
            </div>
          </>
        )}
      </section>
      <ShopFooter config={config} />
    </div>
  )
}
