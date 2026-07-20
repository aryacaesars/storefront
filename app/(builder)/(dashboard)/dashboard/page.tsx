import Link from "next/link"
import { redirect } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import { DashboardPageTitle } from "@/features/builder/components/DashboardHeaderContext"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { DashboardStoreSection } from "@/features/builder/components/DashboardStoreSection"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const session = await requireSession()
  if (session.role === "ADMIN") redirect("/admin")

  const stores = await getStoresByOwnerId(session.userId)

  return (
    <DashboardShell>
      <DashboardPageTitle>Dashboard</DashboardPageTitle>
      <DashboardStoreSection stores={stores} />
    </DashboardShell>
  )
}
