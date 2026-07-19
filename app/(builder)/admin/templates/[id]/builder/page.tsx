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

export const metadata = { title: "Theme Builder" }

/** Prevent browser pinch/page-zoom — only the preview canvas zooms. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

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
    </div>
  )
}
