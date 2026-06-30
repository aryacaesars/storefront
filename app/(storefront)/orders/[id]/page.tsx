import Link from "next/link"
import { notFound } from "next/navigation"
import { requireCustomer } from "@/features/storefront/customer-dal"
import { getCustomerOrder } from "@/server/services/customer.service"
import { formatIdr } from "@/features/storefront/catalog-types"

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  PAID: "Dibayar",
  SHIPPED: "Dikirim",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireCustomer()
  const order = await getCustomerOrder(id, session.customerId, session.storeId)

  if (!order) notFound()

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 @2xl:px-6">
      <Link href="/account" className="text-sm text-[var(--theme-muted)] hover:text-[var(--theme-text)]">
        ← Kembali ke akun
      </Link>

      <div className="mt-4 rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-[var(--theme-text)]"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Pesanan #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-[var(--theme-muted)]">
              {STATUS_LABEL[order.status] ?? order.status}
            </p>
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--theme-primary)" }}>
            {formatIdr(order.total)}
          </p>
        </div>

        <ul className="mt-8 divide-y divide-black/5 border-y border-black/5">
          {order.items.map((item) => {
            const image = item.product.images[0]?.url
            return (
              <li key={item.id} className="flex gap-4 py-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[var(--theme-text)]">{item.product.name}</p>
                    <p className="text-xs text-[var(--theme-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--theme-text)]">
                    {formatIdr(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 flex justify-between text-base font-bold text-[var(--theme-text)]">
          <span>Total</span>
          <span>{formatIdr(order.total)}</span>
        </div>
      </div>
    </section>
  )
}
