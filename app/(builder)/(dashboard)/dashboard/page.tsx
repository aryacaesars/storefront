import Link from "next/link"
import { redirect } from "next/navigation"
import { Store } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { getStoresByOwnerId } from "@/server/services/tenant.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { StoreOverviewCard } from "@/features/builder/components/StoreOverviewCard"
import {
  dashboardBtnPrimary,
  dashboardCard,
  dashboardSectionTitle,
  getDashboardDisplayName,
} from "@/features/builder/components/dashboard-ui"

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
      greetingSubtitle="Kelola semua toko kamu di satu tempat yang rapi dan terpusat."
      action={
        <Link href="/stores/new" className={dashboardBtnPrimary}>
          + Buat Toko
        </Link>
      }
    >
      {stores.length === 0 ? (
        <div className={`${dashboardCard} flex w-full flex-col items-center px-6 py-16 text-center md:py-20`}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dash-primary-light text-dash-primary">
            <Store className="h-7 w-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-dash-ink">Belum ada toko</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-dash-muted">
            Mulai dengan membuat toko pertamamu. Hanya butuh beberapa menit untuk siap berjualan.
          </p>
          <Link href="/stores/new" className={`${dashboardBtnPrimary} mt-8`}>
            Buat Toko Sekarang
          </Link>
        </div>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className={dashboardSectionTitle}>
              {stores.length} {stores.length === 1 ? "Toko" : "Toko"}
            </p>
          </div>
          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
            {stores.map((store) => (
              <StoreOverviewCard
                key={store.id}
                id={store.id}
                name={store.name}
                slug={store.slug}
              />
            ))}
          </div>
        </section>
      )}
    </DashboardShell>
  )
}
