import Link from "next/link"
import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getOrders } from "@/server/services/order.service"
import type { OrderStatus } from "@/server/services/order.service"
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
  const store = await getStoreById(storeId)
  return { title: store ? `Order — ${store.name}` : "Order" }
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

  const orders = await getOrders(storeId)
  const total = orders.length

  return (
    <DashboardShell pageTitle="Order" pageSubtitle={`Total: ${total}`}>
      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">Belum ada order.</p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>Order ID</DashboardTableHeadCell>
                <DashboardTableHeadCell>Customer</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Total</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">Status</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Tanggal</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">
                  Aksi
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
                      {STATUS_LABEL[order.status]}
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
                      label="Lihat order"
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
