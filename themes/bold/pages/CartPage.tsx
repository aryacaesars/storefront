import Link from "next/link"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"
import { formatIdr } from "@/features/storefront/catalog-types"
import { removeFromCart } from "@/app/(storefront)/cart/actions"

export function CartPage({ config, cart = [] }: ThemePageProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="bg-white min-h-screen">
      <section className="mx-auto max-w-4xl px-6 py-12">
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
            <ul className="mt-10 divide-y divide-gray-100 border-y border-gray-100">
              {cart.map((item) => (
                <li key={item.slug} className="flex gap-5 py-6">
                  <div className="h-24 w-24 shrink-0 rounded-sm bg-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-zinc-200" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-lg font-black text-zinc-900">{item.name}</p>
                      <p className="text-sm text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
                        {formatIdr(item.price * item.quantity)}
                      </p>
                      <form action={removeFromCart.bind(null, item.slug)}>
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
              <Link
                href="/checkout"
                className="inline-flex h-12 items-center px-10 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-accent)" }}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </section>
      <PerformanceFooter config={config} />
    </div>
  )
}
