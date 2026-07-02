import { requireAdmin } from "@/features/auth/dal"
import { getAllStoresAdmin } from "@/server/services/admin.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  dashboardCard,
  dashboardTableHeadCell,
  dashboardTableHeadRow,
} from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Admin — Store" }

export default async function AdminStoresPage() {
  await requireAdmin()
  const stores = await getAllStoresAdmin()

  return (
    <DashboardShell pageTitle="Store Aktif" pageSubtitle={`${stores.length} tenant`}>
      {stores.length === 0 ? (
        <div className={`${dashboardCard} p-12 text-center text-sm text-gray-400`}>
          Belum ada store.
        </div>
      ) : (
        <div className={`${dashboardCard} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dashboardTableHeadRow}>
                  <th className={`${dashboardTableHeadCell} text-left`}>Store</th>
                  <th className={`${dashboardTableHeadCell} text-left`}>Owner</th>
                  <th className={`${dashboardTableHeadCell} text-right`}>Produk</th>
                  <th className={`${dashboardTableHeadCell} text-right`}>Order</th>
                  <th className={`${dashboardTableHeadCell} text-right`}>Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="text-xs text-brand/70">{s.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-700">{s.ownerName ?? "—"}</p>
                      <p className="text-xs text-gray-400">{s.ownerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-gray-600">
                      {s.productCount}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-gray-600">
                      {s.orderCount}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-gray-400">
                      {s.createdAt.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
