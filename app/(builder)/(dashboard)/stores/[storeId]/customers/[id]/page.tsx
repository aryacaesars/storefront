import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCustomerById } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardStatCard } from "@/features/builder/components/DashboardStatCard"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { Package, ShoppingCart, Calendar } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string; id: string }> }) {
  const { storeId, id } = await params
  const customer = await getCustomerById(id, storeId)
  return { title: customer ? `Customer — ${customer.name ?? customer.email}` : "Customer" }
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DONE: "Done",
  CANCELLED: "Cancelled",
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-emerald-50 text-emerald-700",
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
    <DashboardShell pageTitle={customer.name ?? "—"} pageSubtitle={customer.email}>
      <div className="flex flex-col gap-6">
        <Link href={`/stores/${storeId}/customers`} className={dashboardBackLink}>
          ← Back to customer list
        </Link>

        <div className="grid gap-6 sm:grid-cols-3">
          <DashboardStatCard
            label="Total Order"
            value={customer.orders.length}
            icon={ShoppingCart}
          />
          <DashboardStatCard label="Total Spent" value={rupiah(totalSpent)} icon={Package} />
          <DashboardStatCard
            label="Joined"
            value={customer.createdAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            icon={Calendar}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <DashboardPanel className="overflow-hidden md:col-span-2">
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-sm font-medium text-ink">Order History</p>
            </div>
            {customer.orders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No orders yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {customer.orders.map((order) => {
                  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
                  return (
                    <li key={order.id}>
                      <Link
                        href={`/stores/${storeId}/orders/${order.id}`}
                        className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-brand/5"
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
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[order.status]}`}
                          >
                            {STATUS_LABEL[order.status]}
                          </span>
                          <span className="text-sm font-medium text-ink">{rupiah(order.total)}</span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </DashboardPanel>

          <DashboardPanel className="p-5">
            <p className="text-sm font-medium text-ink">Address</p>
            {defaultAddress ? (
              <div className="mt-2 text-sm text-gray-600">
                <p>{defaultAddress.street}</p>
                <p>
                  {defaultAddress.city}, {defaultAddress.province} {defaultAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-400">No saved address.</p>
            )}
          </DashboardPanel>
        </div>
      </div>
    </DashboardShell>
  )
}
