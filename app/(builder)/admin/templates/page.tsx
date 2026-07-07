import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { getAllTemplatesAdmin } from "@/server/services/admin.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  dashboardBtnPrimary,
  dashboardCard,
  dashboardCardHover,
} from "@/features/builder/components/dashboard-ui"

export const metadata = { title: "Admin — Template" }

export default async function AdminTemplatesPage() {
  await requireAdmin()
  const templates = await getAllTemplatesAdmin()

  return (
    <DashboardShell
      pageTitle="Template Marketplace"
      pageSubtitle={`${templates.length} template`}
      action={
        <Link href="/admin/templates/new" className={dashboardBtnPrimary}>
          + Tambah Template
        </Link>
      }
    >
      {templates.length === 0 ? (
        <div className={`${dashboardCard} p-12 text-center text-sm text-gray-400`}>
          Belum ada template.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/admin/templates/${t.id}`}
              className={`${dashboardCard} ${dashboardCardHover} overflow-hidden`}
            >
              <div className="flex h-32 items-center justify-center bg-gray-100 text-xs text-gray-300">
                {t.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.previewUrl}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Tidak ada preview"
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${t.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {t.published ? "Terbit" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {t.price === 0 ? "Gratis" : `Rp ${t.price.toLocaleString("id-ID")}`}
                </p>
                <p className="mt-1 text-xs text-gray-400">{t.purchaseCount} pembelian</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
