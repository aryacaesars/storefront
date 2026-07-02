import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getCustomers } from "@/server/services/order.service"
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
  return { title: store ? `Pelanggan — ${store.name}` : "Pelanggan" }
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

  const customers = await getCustomers(storeId)
  const total = customers.length

  return (
    <DashboardShell
      pageTitle="Pelanggan"
      pageSubtitle={`Total: ${total} user terdaftar di toko`}
    >
      {total === 0 ? (
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">
            Belum ada user yang mendaftar di storefront toko ini.
          </p>
        </DashboardPanel>
      ) : (
        <DashboardTable>
          <DashboardTableElement>
            <DashboardTableHead>
              <DashboardTableHeadRow>
                <DashboardTableHeadCell>Pelanggan</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Total Order</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Total Belanja</DashboardTableHeadCell>
                <DashboardTableHeadCell align="right">Bergabung</DashboardTableHeadCell>
                <DashboardTableHeadCell align="center">
                  Aksi
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
                      label="Lihat customer"
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
