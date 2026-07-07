import type { ReactNode } from "react"
import { getSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import { SidebarNavLinks } from "@/features/builder/components/SidebarNavLinks"
import { DashboardLayoutShell } from "@/features/builder/components/DashboardLayoutShell"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  const stores = session ? await getStoresByOwnerId(session.userId) : []

  return (
    <DashboardLayoutShell
      displayName={session?.name ?? "Account"}
      accountSubtitle={session?.role === "ADMIN" ? "Admin" : "Merchant"}
      sidebar={<SidebarNavLinks stores={stores} isAdmin={session?.role === "ADMIN"} />}
    >
      {children}
    </DashboardLayoutShell>
  )
}
