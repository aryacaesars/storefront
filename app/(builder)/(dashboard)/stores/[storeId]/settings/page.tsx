import { notFound } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoreById } from "@/server/services/tenant.service"
import { getStorefrontHost, ROOT_DOMAIN } from "@/lib/tenant/storefront-url"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel } from "@/features/builder/components/dashboard-ui"
import { DeleteStorePanel, SettingsForm } from "./SettingsForm"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const store = await getStoreById(storeId)
  return { title: store ? `Settings — ${store.name}` : "Settings" }
}

export default async function StoreSettingsPage({
  params,
}: {
  params: Promise<{ storeId: string }>
}) {
  const { storeId } = await params
  const session = await requireSession()
  const store = await getStoreById(storeId)
  if (!store || store.ownerId !== session.userId) notFound()

  return (
    <DashboardShell
      pageTitle="Store Settings"
      pageSubtitle={getStorefrontHost(store.slug)}
    >
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <DashboardPanel className="p-6">
          <SettingsForm
            storeId={storeId}
            defaultName={store.name}
            defaultSlug={store.slug}
            defaultPhone={store.contactPhone ?? ""}
            defaultEmail={store.contactEmail ?? ""}
            defaultAddress={store.contactAddress ?? ""}
            rootDomain={ROOT_DOMAIN}
          />
        </DashboardPanel>

        <DeleteStorePanel storeId={storeId} storeName={store.name} />
      </div>
    </DashboardShell>
  )
}
