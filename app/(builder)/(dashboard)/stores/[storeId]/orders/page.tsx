import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getOrders } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"
import { getPageMessages } from "@/features/i18n/get-page-messages"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardTable,
  DashboardTableActionLink,
  DashboardTableAvatarCell,
  DashboardTableBody,
  DashboardTableCell,
  DashboardTableElement,
  DashboardTableFooter,
  DashboardTableHead,
  DashboardTableHeadCell,
  DashboardTableHeadRow,
  DashboardTableRow,
} from "@/features/builder/components/DashboardTable"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const [store, t] = await Promise.all([getStoreById(storeId), getPageMessages()])
  return { title: store ? `${t.orders.title} — ${store.name}` : t.orders.title }
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  PAID: "bg-emerald-50 text-emerald-700",
  SHIPPED: "bg-blue-50 text-blue-700",
  DONE: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-50 text-red-600",
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [orders, t] = await Promise.all([getOrders(storeId), getPageMessages()])
  const total = orders.length

  const statusLabel: Record<OrderStatus, string> = {
    PENDING: t.common.pending,
    PAID: t.common.paid,
    SHIPPED: t.common.shipped,
    DONE: t.common.done,
    CANCELLED: t.common.cancelled,
  }

  return (
    <DashboardShell
      pageTitle={t.orders.title}
      pageSubtitle={t.orders.totalLabel.replace("{n}", String(total))}
    >
      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">{t.orders.empty}</p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>{t.orders.colId}</DashboardTableHeadCell>
                <DashboardTableHeadCell>{t.orders.colCustomer}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.orders.colTotal}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">{t.orders.colStatus}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.orders.colDate}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">
                  {t.common.actions}
                </DashboardTableHeadCell>
              </DashboardTableHeadRow>
            </DashboardTableHead>
            <DashboardTableBody>
              {orders.map((order, index) => (
                <DashboardTableRow key={order.id} index={index}>
                  <DashboardTableCell className="font-mono text-xs text-gray-600">
                    #{order.id.slice(-8).toUpperCase()}
                  </DashboardTableCell>
                  <DashboardTableCell>
                    <DashboardTableAvatarCell
                      name={order.customer.name ?? "—"}
                      subtitle={order.customer.email}
                    />
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="font-medium text-ink">
                    Rp {order.total.toLocaleString("id-ID")}
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[order.status]}`}
                    >
                      {statusLabel[order.status]}
                    </span>
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="text-xs text-gray-500">
                    {order.createdAt.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <DashboardTableActionLink
                      href={`/stores/${storeId}/orders/${order.id}`}
                      label={t.orders.viewAria}
                      icon="eye"
                    />
                  </DashboardTableCell>
                </DashboardTableRow>
              ))}
            </DashboardTableBody>
          </DashboardTableElement>
          <DashboardTableFooter from={1} to={total} total={total} />
        </DashboardTable>
      )}
    </DashboardShell>
  )
}
