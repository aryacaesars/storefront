import Link from "next/link"
import { notFound } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  Package,
  Palette,
  Pencil,
  Settings,
  ShoppingCart,
  Tag,
  TrendingUp,
} from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getStoreDashboardStats } from "@/server/services/order.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardStatCard } from "@/features/builder/components/DashboardStatCard"
import {
  dashboardBtnOutline,
  dashboardCardHover,
  dashboardLink,
  DashboardPanel,
} from "@/features/builder/components/dashboard-ui"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Dashboard — ${store.name}` : "Dashboard" }
}

const quickActions = [
  { href: "products", label: "Produk", icon: Package },
  { href: "orders", label: "Order", icon: ShoppingCart },
  { href: "customize", label: "Kustomisasi", icon: Pencil },
  { href: "settings", label: "Pengaturan", icon: Settings },
] as const

function QuickActionLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: LucideIcon
}) {
  return (
    <Link
      href={href}
      className={cn(
        dashboardCardHover,
        "group flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border border-transparent px-3 py-4 text-center transition-all duration-200 sm:py-5",
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dash-bg text-dash-muted transition-colors duration-200 group-hover:bg-dash-primary-light group-hover:text-dash-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <span className="text-sm font-medium text-dash-ink">{label}</span>
    </Link>
  )
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
    <DashboardShell pageTitle={store.name} pageSubtitle="Ringkasan performa dan aktivitas toko kamu.">
      <div className="flex flex-col gap-5 lg:gap-6">
        {/* Statistik */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {statCards.map((card) => (
            <DashboardStatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Panel bawah: aksi cepat + template sejajar */}
        <div
          className={cn(
            "grid gap-5 lg:items-stretch lg:gap-6",
            stats.activeTemplate ? "lg:grid-cols-5" : "lg:grid-cols-1",
          )}
        >
          <DashboardPanel
            title="Aksi Cepat"
            className={stats.activeTemplate ? "lg:col-span-3" : undefined}
          >
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 sm:gap-3 sm:p-5">
              {quickActions.map(({ href, label, icon }) => (
                <QuickActionLink
                  key={href}
                  href={`/stores/${storeId}/${href}`}
                  label={label}
                  icon={icon}
                />
              ))}
            </div>
          </DashboardPanel>

          {stats.activeTemplate && (
            <DashboardPanel
              title="Template Aktif"
              className="flex flex-col lg:col-span-2"
              action={
                <Link
                  href={`/stores/${storeId}/templates`}
                  className={cn(dashboardLink, "inline-flex items-center gap-1 text-sm")}
                >
                  Kelola
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              }
            >
              <div className="flex flex-1 flex-col justify-center gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dash-primary-light text-dash-primary">
                    <Palette className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold capitalize text-dash-ink">
                      {stats.activeTemplate}
                    </p>
                    <p className="mt-0.5 text-sm text-dash-muted">
                      Digunakan di storefront kamu
                    </p>
                  </div>
                </div>
                <Link
                  href={`/stores/${storeId}/templates`}
                  className={cn(dashboardBtnOutline, "w-full shrink-0 gap-2 sm:hidden")}
                >
                  Kelola Template
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </DashboardPanel>
          )}
        </div>

        <p className="text-center text-sm text-dash-muted sm:text-left">
          Butuh bantuan?{" "}
          <Link href="/support" className={dashboardLink}>
            Hubungi support
          </Link>
        </p>
      </div>
    </DashboardShell>
  )
}
