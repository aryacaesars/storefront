import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getOrderById, ALLOWED_TRANSITIONS } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"
import { updateStatusAction } from "./actions"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string; id: string }> }) {
  const { id } = await params
  return { title: `Order #${id.slice(-8).toUpperCase()}` }
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  PAID: "Dibayar",
  SHIPPED: "Dikirim",
  DONE: "Selesai",
  CANCELLED: "Dibatalkan",
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-green-50 text-green-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  DONE: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-50 text-red-600",
}

const ACTION_LABEL: Record<OrderStatus, string> = {
  PENDING: "Tandai Menunggu",
  PAID: "Tandai Dibayar",
  SHIPPED: "Tandai Dikirim",
  DONE: "Tandai Selesai",
  CANCELLED: "Batalkan Order",
}

function rupiah(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string; id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { storeId, id } = await params
  const { error } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const order = await getOrderById(id, storeId)
  if (!order) notFound()

  const address = order.customer.addresses.find((a) => a.isDefault) ?? order.customer.addresses[0]
  const nextStatuses = ALLOWED_TRANSITIONS[order.status]

  return (
    <div className="p-6 max-w-4xl">
      <Link href={`/stores/${storeId}/orders`} className="text-sm text-gray-400 hover:text-gray-700">
        ← Kembali ke daftar order
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {order.createdAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_CLASS[order.status]}`}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* Status actions */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-medium text-gray-700">Ubah Status</p>
        {nextStatuses.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">Status final, tidak bisa diubah lagi.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {nextStatuses.map((next) => (
              <form key={next} action={updateStatusAction.bind(null, storeId, order.id, next)}>
                <button
                  type="submit"
                  className={
                    next === "CANCELLED"
                      ? "rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      : "rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                  }
                >
                  {ACTION_LABEL[next]}
                </button>
              </form>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Items */}
        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-sm font-medium text-gray-700">Item Pesanan</p>
          </div>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => {
              const image = item.product.images[0]?.url
              return (
                <li key={item.id} className="flex gap-4 px-5 py-4">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-400">
                        {rupiah(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {rupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex justify-between border-t border-gray-100 px-5 py-4">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-sm font-semibold text-gray-900">{rupiah(order.total)}</span>
          </div>
        </div>

        {/* Customer + shipping */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-700">Customer</p>
            <Link
              href={`/stores/${storeId}/customers/${order.customerId}`}
              className="mt-2 block text-sm font-medium text-gray-900 hover:underline"
            >
              {order.customer.name ?? "—"}
            </Link>
            <p className="text-xs text-gray-400">{order.customer.email}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-700">Alamat Pengiriman</p>
            {address ? (
              <div className="mt-2 text-sm text-gray-600">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.province} {address.postalCode}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">Tidak ada alamat tersimpan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
