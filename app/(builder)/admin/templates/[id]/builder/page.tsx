import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/features/auth/dal"
import { getTemplateById, normalizeThemeSlug } from "@/server/services/template.service"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { TEMPLATE_META } from "@/themes/engine/registry"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { CustomizeWorkspace } from "@/features/builder/components/CustomizeWorkspace"
import { savePlatformBaseAction } from "./actions"

export const metadata = { title: "Admin — Theme Builder" }

export default async function AdminThemeBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const template = await getTemplateById(id)
  if (!template) notFound()

  const templateId = normalizeThemeSlug(template.slug)
  if (!templateId) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Link href={`/admin/templates/${id}`} className={dashboardBackLink}>
          ← Kembali ke template
        </Link>
        <DashboardPanel className="p-6">
          <p className="text-sm font-semibold text-gray-900">
            Builder visual tidak tersedia
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Builder visual hanya untuk theme engine (bento / bold / fashion /
            minimalist). Slug template ini: <span className="font-mono">{template.slug}</span>.
          </p>
        </DashboardPanel>
      </div>
    )
  }

  const initialConfig = await getPlatformBaseConfig(templateId)
  const save = savePlatformBaseAction.bind(null, templateId)
  const previewHref = `/preview/${templateId}`

  // Overlay full-screen: route ini mewarisi chrome DashboardLayoutShell dari
  // admin/layout.tsx, sedangkan editor butuh seluruh viewport.
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <CustomizeWorkspace
        templateId={templateId}
        templateName={`${TEMPLATE_META[templateId].name} — Base Template`}
        initialConfig={initialConfig}
        storefrontHost={previewHref}
        onSaveDraft={save}
        onPublish={save}
      />
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-lg">
        <Link
          href={previewHref}
          target="_blank"
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
        >
          Lihat /preview ↗
        </Link>
        <Link
          href={`/admin/templates/${id}`}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
        >
          Keluar
        </Link>
      </div>
    </div>
  )
}
