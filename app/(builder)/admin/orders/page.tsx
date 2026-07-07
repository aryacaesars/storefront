import { requireAdmin } from "@/features/auth/dal"
import { getAllPurchasesAdmin } from "@/server/services/admin.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  dashboardCard,
  dashboardTableHeadCell,
  dashboardTableHeadRow,
} from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Admin — Transaksi" }

const STATUS_CLASS: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  FAILED: "bg-red-50 text-red-600",
}

export default async function AdminOrdersPage() {
  await requireAdmin()
  const purchases = await getAllPurchasesAdmin()

  return (
    <DashboardShell
      pageTitle="Transaksi Template"
      pageSubtitle={`${purchases.length} transaksi`}
    >
      {purchases.length === 0 ? (
        <div className={`${dashboardCard} p-12 text-center text-sm text-gray-400`}>
          Belum ada transaksi.
        </div>
      ) : (
        <div className={`${dashboardCard} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={dashboardTableHeadRow}>
                  <th className={`${dashboardTableHeadCell} text-left`}>Store</th>
                  <th className={`${dashboardTableHeadCell} text-left`}>Template</th>
                  <th className={`${dashboardTableHeadCell} text-right`}>Harga</th>
                  <th className={`${dashboardTableHeadCell} text-center`}>Status</th>
                  <th className={`${dashboardTableHeadCell} text-right`}>Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{p.storeName}</p>
                      <p className="text-xs text-brand/70">{p.storeSlug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{p.templateName}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-ink">
                      Rp {p.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[p.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-gray-400">
                      {(p.paidAt ?? p.createdAt).toLocaleDateString("id-ID", {
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
