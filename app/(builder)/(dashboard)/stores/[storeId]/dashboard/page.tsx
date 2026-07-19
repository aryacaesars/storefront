import { notFound } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getStoreDashboardStats } from "@/server/services/order.service"
import { getStorefrontUrl } from "@/lib/tenant/storefront-url"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPageTitle } from "@/features/builder/components/DashboardHeaderContext"
import { StoreDashboardBento } from "@/features/builder/components/StoreDashboardBento"
import { dashboardBtnPrimary } from "@/features/builder/components/dashboard-ui"

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
  const storefrontUrl = getStorefrontUrl(store.slug)

  return (
    <DashboardShell
      pageSubtitle="Ringkasan performa dan aktivitas toko kamu."
      action={
        <a
          href={storefrontUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={dashboardBtnPrimary}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Live store
        </a>
      }
    >
      <DashboardPageTitle>{store.name}</DashboardPageTitle>
      <StoreDashboardBento storeId={storeId} stats={stats} />
    </DashboardShell>
  )
}
