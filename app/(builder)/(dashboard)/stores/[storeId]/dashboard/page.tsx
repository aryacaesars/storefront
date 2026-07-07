import Link from "next/link"
import { notFound } from "next/navigation"
import { Package, Palette, ShoppingCart, Tag, TrendingUp } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getStoreDashboardStats } from "@/server/services/order.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardStatCard } from "@/features/builder/components/DashboardStatCard"
import { StoreOverviewCard } from "@/features/builder/components/StoreOverviewCard"
import { dashboardBtnOutline, dashboardCard, getDashboardDisplayName } from "@/features/builder/components/dashboard-ui"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Dashboard — ${store.name}` : "Dashboard" }
}

export default async function StoreDashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  const stats = await getStoreDashboardStats(storeId)
  const displayName = getDashboardDisplayName(session.name)

  const statCards = [
    { label: "Produk Aktif", value: stats.totalProducts, icon: Package },
    { label: "Kategori", value: stats.totalCategories, icon: Tag },
    { label: "Total Order", value: stats.totalOrders, icon: ShoppingCart },
    {
      label: "Revenue (PAID)",
      value: `Rp ${stats.revenueTotal.toLocaleString("id-ID")}`,
      icon: TrendingUp,
    },
  ]

  return (
    <DashboardShell
      showGreeting
      displayName={displayName}
      greetingSubtitle={`Ringkasan performa ${store.name}.`}
    >
      <div className="flex flex-col gap-6">
        <StoreOverviewCard
          id={store.id}
          name={store.name}
          slug={store.slug}
          variant="compact"
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <DashboardStatCard key={card.label} {...card} />
          ))}
        </div>

        {stats.activeTemplate && (
          <article className={`${dashboardCard} flex flex-wrap items-center justify-between gap-4 p-5 md:p-6`}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dash-primary/10 text-dash-primary">
                <Palette className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">
                  Template aktif:{" "}
                  <span className="capitalize text-dash-primary">{stats.activeTemplate}</span>
                </p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Storefront kamu menggunakan template ini
                </p>
              </div>
            </div>
            <Link
              href={`/stores/${storeId}/templates`}
              className={dashboardBtnOutline}
            >
              Kelola Template
            </Link>
          </article>
        )}
      </div>
    </DashboardShell>
  )
}
