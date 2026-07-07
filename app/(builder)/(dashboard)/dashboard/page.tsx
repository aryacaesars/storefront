import Link from "next/link"
import { redirect } from "next/navigation"
import { requireSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { StoreOverviewCard } from "@/features/builder/components/StoreOverviewCard"
import { dashboardBtnPrimary, dashboardCard, getDashboardDisplayName } from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Dashboard — Etalase" }

export default async function DashboardPage() {
  const session = await requireSession()
  if (session.role === "ADMIN") redirect("/admin")

  const stores = await getStoresByOwnerId(session.userId)
  const displayName = getDashboardDisplayName(session.name)

  return (
    <DashboardShell
      showGreeting
      displayName={displayName}
      greetingSubtitle="Kelola semua store kamu di satu tempat."
      action={
        <Link href="/stores/new" className={dashboardBtnPrimary}>
          + Buat Store
        </Link>
      }
    >
      {stores.length === 0 ? (
        <div className={`${dashboardCard} mx-auto max-w-lg p-10 text-center`}>
          <p className="text-base text-gray-500">Belum ada store. Buat store pertama kamu.</p>
          <Link href="/stores/new" className={`${dashboardBtnPrimary} mt-6`}>
            Buat Store Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {stores.map((store) => (
            <StoreOverviewCard
              key={store.id}
              id={store.id}
              name={store.name}
              slug={store.slug}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
