import { requireSession } from "@/features/auth/dal"
import { cn } from "@/lib/utils"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardPanel, dashboardFormWidth, dashboardLabel } from "@/features/builder/components/dashboard-ui"
import { getPageMessages } from "@/features/i18n/get-page-messages"

export const metadata = { title: "Profile" }

export default async function ProfilePage() {
  const session = await requireSession()
  const t = await getPageMessages()

  return (
    <DashboardShell pageTitle={t.profile.title} pageSubtitle={t.profile.subtitle}>
      <DashboardPanel className={cn(dashboardFormWidth, "p-6")}>
        <dl className="space-y-5">
          <div>
            <dt className={dashboardLabel}>{t.profile.merchantName}</dt>
            <dd className="text-sm text-gray-900">{session.name}</dd>
          </div>
          <div>
            <dt className={dashboardLabel}>{t.profile.store}</dt>
            {/* @ts-expect-error TODO Sprint 2: add storeSlug to SessionData */}
            <dd className="text-sm text-gray-900">{session.tenantSlug}</dd>
          </div>
          <div>
            <dt className={dashboardLabel}>{t.profile.plan}</dt>
            <dd className="text-sm text-gray-900">{t.profile.planValue}</dd>
          </div>
        </dl>
      </DashboardPanel>
    </DashboardShell>
  )
}
