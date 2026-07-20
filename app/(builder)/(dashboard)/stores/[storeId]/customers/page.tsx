import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCustomers } from "@/server/services/order.service"
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
  return { title: store ? `${t.customers.title} — ${store.name}` : t.customers.title }
}

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const [customers, t] = await Promise.all([getCustomers(storeId), getPageMessages()])
  const total = customers.length

  return (
    <DashboardShell
      pageTitle={t.customers.title}
      pageSubtitle={t.customers.totalLabel.replace("{n}", String(total))}
    >
      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">{t.customers.empty}</p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>{t.customers.colCustomer}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.customers.colOrders}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.customers.colSpent}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">{t.customers.colJoined}</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">
                  {t.common.actions}
                </DashboardTableHeadCell>
              </DashboardTableHeadRow>
            </DashboardTableHead>
            <DashboardTableBody>
              {customers.map((customer, index) => (
                <DashboardTableRow key={customer.id} index={index}>
                  <DashboardTableCell>
                    <DashboardTableAvatarCell
                      name={customer.name ?? "—"}
                      subtitle={customer.email}
                    />
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="text-gray-600">
                    {customer._count.orders}
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="font-medium text-ink">
                    Rp {customer.totalSpent.toLocaleString("id-ID")}
                  </DashboardTableCell>
                  <DashboardTableCell align="right" className="text-xs text-gray-500">
                    {customer.createdAt.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </DashboardTableCell>
                  <DashboardTableCell align="center">
                    <DashboardTableActionLink
                      href={`/stores/${storeId}/customers/${customer.id}`}
                      label={t.customers.viewAria}
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
