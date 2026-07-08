import Link from "next/link"
import { Store } from "lucide-react"
import { requireSession } from "@/features/auth/dal"
import { TemplateCard } from "@/features/builder/components/TemplateCard"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { dashboardBtnPrimary, dashboardCard } from "@/features/builder/components/dashboard-ui"
import { getActiveTemplateId, isTemplatePreviewReady } from "@/features/builder/theme-state"
import { TEMPLATE_IDS, TEMPLATE_META } from "@/themes/engine/registry"

export const metadata = { title: "Storefront — Template Saya" }

export default async function TemplatesPage() {
  await requireSession()
  const activeTemplateId = await getActiveTemplateId()

  const templates = TEMPLATE_IDS.map((id) => ({
    id,
    name: TEMPLATE_META[id].name,
    description: TEMPLATE_META[id].description,
    active: id === activeTemplateId,
    previewReady: isTemplatePreviewReady(id),
    purchasedAt: id === "minimalist" ? "5 Mar 2026" : undefined,
  }))

  return (
    <DashboardShell
      pageTitle="Template Saya"
      pageSubtitle="Koleksi template yang sudah kamu beli. Aktifkan atau kelola desain storefront."
    >
      {templates.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} {...template} />
          ))}
        </div>
      ) : (
        <div
          className={`${dashboardCard} flex w-full flex-col items-center justify-center px-8 py-16 text-center`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-dash-primary/10 text-dash-primary">
            <Store className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Belum ada template yang dibeli
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-500">
            Jelajahi katalog template di halaman utama Etalase untuk menemukan desain yang cocok
            dengan toko kamu.
          </p>
          <Link href="/#templates" className={dashboardBtnPrimary}>
            Jelajahi Template
          </Link>
        </div>
      )}
    </DashboardShell>
  )
}
