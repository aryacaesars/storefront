import Link from "next/link"
import { Store } from "lucide-react"
import { CreateStoreForm } from "@/features/builder/components/CreateStoreForm"
import { requireSession } from "@/features/auth/dal"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { ROOT_DOMAIN } from "@/lib/tenant/storefront-url"

export const metadata = { title: "Buat Store Baru" }

export default async function NewStorePage() {
  await requireSession()

  return (
    <DashboardShell
      pageTitle="Buat Store Baru"
      pageSubtitle="Siapkan identitas toko. Subdomain jadi alamat storefront publik kamu."
    >
      <div className="flex w-full flex-col gap-5">
        <Link href="/dashboard" className={dashboardBackLink}>
          ← Kembali ke Dashboard
        </Link>

        <DashboardPanel className="overflow-hidden p-0">
          <div className="border-b border-dash-border/80 bg-dash-bg/40 px-6 py-5 sm:px-8">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dash-primary-light text-dash-primary ring-1 ring-dash-primary/15">
                <Store className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dash-ink">Identitas toko</p>
                <p className="mt-1 text-sm leading-relaxed text-dash-muted">
                  Isi nama dan subdomain. Setelah dibuat, kamu bisa langsung kelola produk
                  dan template.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <CreateStoreForm rootDomain={ROOT_DOMAIN} />
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
