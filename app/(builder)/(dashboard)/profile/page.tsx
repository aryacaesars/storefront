import { requireSession } from "@/features/auth/dal"
import { cn } from "@/lib/utils"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel, dashboardFormWidth, dashboardLabel } from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Profile" }

export default async function ProfilePage() {
  const session = await requireSession()

  return (
    <DashboardShell pageTitle="Profile" pageSubtitle="Informasi akun merchant kamu.">
      <DashboardPanel className={cn(dashboardFormWidth, "p-6")}>
        <dl className="space-y-5">
          <div>
            <dt className={dashboardLabel}>Nama Merchant</dt>
            <dd className="text-sm text-gray-900">{session.name}</dd>
          </div>
          <div>
            <dt className={dashboardLabel}>Toko</dt>
            {/* @ts-expect-error TODO Sprint 2: add storeSlug to SessionData */}
            <dd className="text-sm text-gray-900">{session.tenantSlug}</dd>
          </div>
          <div>
            <dt className={dashboardLabel}>Paket</dt>
            <dd className="text-sm text-gray-900">Pro Merchant</dd>
          </div>
        </dl>
      </DashboardPanel>
    </DashboardShell>
  )
}
