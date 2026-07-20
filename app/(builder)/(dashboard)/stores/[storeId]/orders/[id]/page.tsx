import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getOrderById, ALLOWED_TRANSITIONS } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
  dashboardBtnPrimary,
  dashboardLink,
} from "@/features/builder/components/dashboard-ui"
import { updateStatusAction } from "./actions"
import { DashboardInitialNotice } from "@/features/builder/hooks/useDashboardActionNotice"
import type { DashboardNotice } from "@/features/builder/hooks/useDashboardActionNotice"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string; id: string }> }) {
  const { id } = await params
  const t = await getPageMessages()
  return {
    title: t.orders.detailTitle.replace("{id}", id.slice(-8).toUpperCase()),
  }
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

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string; id: string }>
  searchParams: Promise<{ error?: string; notice?: string; message?: string }>
}) {
  const { storeId, id } = await params
  const { error, notice, message } = await searchParams
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [order, t] = await Promise.all([getOrderById(id, storeId), getPageMessages()])
  if (!order) notFound()

  const address = order.customer.addresses.find((a) => a.isDefault) ?? order.customer.addresses[0]
  const nextStatuses = ALLOWED_TRANSITIONS[order.status]

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t.common.pending,
    PAID: t.common.paid,
    SHIPPED: t.common.shipped,
    DONE: t.common.done,
    CANCELLED: t.common.cancelled,
  }

  const actionLabel: Record<OrderStatus, string> = {
    PENDING: t.orders.markPending,
    PAID: t.orders.markPaid,
    SHIPPED: t.orders.markShipped,
    DONE: t.orders.markDone,
    CANCELLED: t.orders.cancelOrder,
  }

  let initialNotice: DashboardNotice | null = null
  if (notice === "success") {
    initialNotice = {
      type: "success",
      message: t.orders.updatedNotice,
    }
  } else if (notice === "error" && message) {
    initialNotice = { type: "error", message: decodeURIComponent(message) }
  } else if (error) {
    initialNotice = { type: "error", message: error }
  }

  return (
    <DashboardShell
      pageTitle={t.orders.detailTitle.replace("{id}", order.id.slice(-8).toUpperCase())}
      pageSubtitle={order.createdAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
      action={
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[order.status]}`}
        >
          {statusLabel[order.status]}
        </span>
      }
    >
      <DashboardInitialNotice notice={initialNotice} />
      <div className="flex flex-col gap-6">
        <Link href={`/stores/${storeId}/orders`} className={dashboardBackLink}>
          {t.orders.backToList}
        </Link>

        <DashboardPanel className="p-5">
          <p className="text-sm font-medium text-ink">{t.orders.updateStatus}</p>
          {nextStatuses.length === 0 ? (
            <p className="mt-2 text-xs text-gray-400">{t.orders.finalStatus}</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {nextStatuses.map((next) => (
                <form key={next} action={updateStatusAction.bind(null, storeId, order.id, next)}>
                  <button
                    type="submit"
                    className={
                      next === "CANCELLED"
                        ? "rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                        : dashboardBtnPrimary
                    }
                  >
                    {actionLabel[next]}
                  </button>
                </form>
              ))}
            </div>
          )}
        </DashboardPanel>

        <div className="grid gap-6 md:grid-cols-3">
          <DashboardPanel className="overflow-hidden md:col-span-2">
            <div className="border-b border-gray-100 px-5 py-3">
              <p className="text-sm font-medium text-ink">{t.orders.orderItems}</p>
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
                        <p className="text-sm font-medium text-ink">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          {rupiah(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-ink">
                        {rupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-between border-t border-gray-100 px-5 py-4">
              <span className="text-sm font-semibold text-gray-700">{t.common.total}</span>
              <span className="text-sm font-semibold text-ink">{rupiah(order.total)}</span>
            </div>
          </DashboardPanel>

          <div className="space-y-6">
            <DashboardPanel className="p-5">
              <p className="text-sm font-medium text-ink">{t.orders.customer}</p>
              <Link
                href={`/stores/${storeId}/customers/${order.customerId}`}
                className={`mt-2 block font-medium text-ink ${dashboardLink}`}
              >
                {order.customer.name ?? "—"}
              </Link>
              <p className="text-xs text-gray-400">{order.customer.email}</p>
            </DashboardPanel>

            <DashboardPanel className="p-5">
              <p className="text-sm font-medium text-ink">{t.orders.shippingAddress}</p>
              {address ? (
                <div className="mt-2 text-sm text-gray-600">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.province} {address.postalCode}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-400">{t.orders.noAddress}</p>
              )}
            </DashboardPanel>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
