import Link from "next/link"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { removeFromCart, updateQuantity } from "@/app/(storefront)/cart/actions"

export function CartPage({ cart = [] }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1
        className="text-3xl font-semibold text-[var(--theme-text)]"
        style={{ fontFamily: "var(--theme-heading-font)" }}
      >
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-[var(--theme-muted)]">
        {cart.length} item{cart.length !== 1 ? "s" : ""}
      </p>

      {cart.length === 0 ? (
        <div className="mt-10 py-16 text-center">
          <p className="text-sm text-[var(--theme-muted)]">Cart kamu kosong.</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--theme-primary)" }}
          >
            Lihat Produk
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-black/5 border-y border-black/5">
            {cart.map((item) => (
              <li key={item.lineKey} className="flex gap-5 py-6">
                <Link
                  href={`/products/${item.slug}`}
                  className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-gray-100"
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
                    {item.priceMismatch && item.currentPrice !== undefined && (
                      <p className="mt-2 text-xs text-yellow-700">⚠️ Harga berubah: sekarang {formatIdr(item.currentPrice)}. Periksa pilihan varian.</p>
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
                    <p className="text-sm font-semibold text-[var(--theme-text)]">
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

          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="flex w-full max-w-xs justify-between text-sm">
              <span className="text-[var(--theme-muted)]">Subtotal</span>
              <span className="font-semibold text-[var(--theme-text)]">{formatIdr(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="inline-flex h-11 w-full max-w-xs items-center justify-center text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
