import Link from "next/link"
import { CreateStoreForm } from "@/features/builder/components/CreateStoreForm"
import { requireSession } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Buat Store Baru — Etalase" }

export default async function NewStorePage() {
  const session = await requireSession()

  return (
    <DashboardShell pageTitle="Buat Store Baru">
      <div className="flex w-full max-w-xl flex-col gap-4">
        <Link href="/dashboard" className={dashboardBackLink}>
          ← Kembali ke Dashboard
        </Link>
        <DashboardPanel className="w-full max-w-xl p-6">
          <CreateStoreForm />
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
