import { requireAdmin } from "@/features/auth/dal"
import { getAdminOverview } from "@/server/services/admin.service"
import { Store, LayoutTemplate, ShoppingCart, DollarSign } from "lucide-react"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardStatCard } from "@/features/builder/components/DashboardStatCard"

export const metadata = { title: "Admin — Overview" }

export default async function AdminOverviewPage() {
  await requireAdmin()
  const stats = await getAdminOverview()

  const cards = [
    { label: "Total Store", value: stats.totalStores, icon: Store },
    {
      label: "Template Terbit",
      value: `${stats.publishedTemplates}/${stats.totalTemplates}`,
      icon: LayoutTemplate,
    },
    { label: "Transaksi PAID", value: stats.totalPurchases, icon: ShoppingCart },
    {
      label: "Revenue Template",
      value: `Rp ${stats.revenueTotal.toLocaleString("id-ID")}`,
      icon: DollarSign,
    },
  ]

  return (
    <DashboardShell
      pageTitle="Platform Overview"
      pageSubtitle="Ringkasan seluruh platform Etalase"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <DashboardStatCard key={c.label} {...c} />
        ))}
      </div>
    </DashboardShell>
  )
}
