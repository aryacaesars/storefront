import { requireSession } from "@/features/auth/dal"
import { LiveEnvironmentCard } from "@/features/builder/components/LiveEnvironmentCard"
import { ActiveThemeCard } from "@/features/builder/components/ActiveThemeCard"
import { OrderFulfillmentCard } from "@/features/builder/components/OrderFulfillmentCard"
import { CatalogStatusCard } from "@/features/builder/components/CatalogStatusCard"
import { getStorefrontHost } from "@/lib/tenant/storefront-url"
// TODO Sprint 2: reconnect to Prisma data source — getTenantById removed; use getStoreById
// import { getTenantById } from "@/server/services/tenant.service"

export const metadata = { title: "Dashboard — Storefront Builder" }

export default async function DashboardPage() {
  const session = await requireSession()
  // TODO Sprint 2: reconnect to Prisma — use session.storeId with getStoreById
  const tenant = null
  // @ts-expect-error TODO Sprint 2: session.tenantSlug not in new SessionData shape
  const storefrontHost = getStorefrontHost(session.tenantSlug ?? "")

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-[1fr_320px] gap-5 h-full max-h-[600px]">
        <div className="flex flex-col justify-start">
          <LiveEnvironmentCard
            // @ts-expect-error TODO Sprint 2: session.tenantSlug not in new SessionData shape
            tenantSlug={session.tenantSlug ?? ""}
            storefrontHost={storefrontHost}
          />
        </div>

        <div className="flex flex-col gap-5">
          {/* @ts-expect-error TODO Sprint 2: session.tenantSlug not in new SessionData shape */}
          <CatalogStatusCard tenant={tenant} tenantSlug={session.tenantSlug ?? ""} />
          <ActiveThemeCard />
          <OrderFulfillmentCard />
        </div>
      </div>
    </div>
  )
}
