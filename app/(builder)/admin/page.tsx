import { requireAdmin } from "@/features/auth/dal"
import { getAdminOverview } from "@/server/services/admin.service"
import { Store, LayoutTemplate, ShoppingCart, DollarSign } from "lucide-react"

export const metadata = { title: "Admin — Overview" }

export default async function AdminOverviewPage() {
  await requireAdmin()
  const stats = await getAdminOverview()

  const cards = [
    { label: "Total Store", value: stats.totalStores.toString(), icon: Store },
    { label: "Template", value: `${stats.publishedTemplates}/${stats.totalTemplates} terbit`, icon: LayoutTemplate },
    { label: "Transaksi PAID", value: stats.totalPurchases.toString(), icon: ShoppingCart },
    { label: "Revenue Template", value: `$${(stats.revenueTotal / 100).toFixed(2)}`, icon: DollarSign },
  ]

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Platform Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Ringkasan seluruh platform Etalase</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{c.label}</p>
                <Icon className="w-4 h-4 text-gray-300" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{c.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
