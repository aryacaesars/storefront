"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Minus, Plus } from "lucide-react"
import { updateQuantity } from "@/app/(storefront)/cart/actions"
import { formatIdr } from "@/features/storefront/catalog-types"
import { normalizeCartItem, type CartItem } from "@/lib/storefront/cart"

export function CheckoutCartLines({ cart }: { cart: CartItem[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function changeQty(lineKey: string, quantity: number) {
    startTransition(async () => {
      await updateQuantity(lineKey, quantity)
      router.refresh()
    })
  }

  if (cart.length === 0) {
    return (
      <p className="text-sm text-[#515160]">
        Your cart is empty.{" "}
        <Link href="/products" className="font-semibold text-[var(--theme-primary)]">
          Shop now
        </Link>
      </p>
    )
  }

  return (
    <ul className={`space-y-4 ${pending ? "opacity-70" : ""}`}>
      {cart.map((item) => (
        <li key={item.lineKey} className="flex gap-3">
          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#1a1c1b]">{item.name}</p>
            <p className="mt-0.5 text-xs text-[#515160]">{formatIdr(item.price)}</p>
            {item.needsVariantSelection && (
              <p className="mt-2 text-xs text-yellow-700">⚠️ Produk memiliki varian baru — pilih varian di halaman produk.</p>
            )}
            {item.variantUnavailable && (
              <p className="mt-2 text-xs text-red-600">⚠️ Varian ini sudah tidak tersedia. Hapus item lalu pilih ulang di halaman produk.</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-black/10">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={pending}
                  onClick={() => changeQty(item.lineKey, item.quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center text-[#515160] transition-colors hover:text-[var(--theme-primary)] disabled:opacity-50"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <span className="min-w-[1.5rem] text-center text-xs font-bold text-[#1a1c1b]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={pending}
                  onClick={() => changeQty(item.lineKey, item.quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center text-[#515160] transition-colors hover:text-[var(--theme-primary)] disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
              <Link
                href={`/products/${item.slug}`}
                className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-primary)]"
              >
                Edit product
              </Link>
            </div>
          </div>
          <p className="shrink-0 text-sm font-bold text-[#1a1c1b]">
            {formatIdr(item.price * item.quantity)}
          </p>
        </li>
      ))}
    </ul>
  )
}
