import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCustomerById } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string; id: string }> }) {
  const { storeId, id } = await params
  const customer = await getCustomerById(id, storeId)
  return { title: customer ? `Customer — ${customer.name ?? customer.email}` : "Customer" }
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

function rupiah(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ storeId: string; id: string }>
}) {
  const { storeId, id } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const customer = await getCustomerById(id, storeId)
  if (!customer) notFound()

  const totalSpent = customer.orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.total, 0)
  const defaultAddress =
    customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0]

  return (
    <div className="p-6 max-w-4xl">
      <Link href={`/stores/${storeId}/customers`} className="text-sm text-gray-400 hover:text-gray-700">
        ← Kembali ke daftar customer
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-gray-900">{customer.name ?? "—"}</h1>
        <p className="mt-1 text-sm text-gray-400">{customer.email}</p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Order</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{customer.orders.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Belanja</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{rupiah(totalSpent)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bergabung</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {customer.createdAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Orders */}
        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-sm font-medium text-gray-700">Riwayat Order</p>
          </div>
          {customer.orders.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">Belum ada order.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {customer.orders.map((order) => {
                const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
                return (
                  <li key={order.id}>
                    <Link
                      href={`/stores/${storeId}/orders/${order.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-mono text-xs text-gray-500">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {itemCount} item ·{" "}
                          {order.createdAt.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[order.status]}`}
                        >
                          {STATUS_LABEL[order.status]}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{rupiah(order.total)}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Address */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-700">Alamat</p>
          {defaultAddress ? (
            <div className="mt-2 text-sm text-gray-600">
              <p>{defaultAddress.street}</p>
              <p>
                {defaultAddress.city}, {defaultAddress.province} {defaultAddress.postalCode}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-400">Tidak ada alamat tersimpan.</p>
          )}
        </div>
      </div>
    </div>
  )
}
