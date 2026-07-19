import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { getAllTemplatesAdmin } from "@/server/services/admin.service"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { normalizeThemeSlug } from "@/server/services/template.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import { AdminTemplateCard } from "@/features/builder/components/AdminTemplateCard"
import {
  dashboardBtnPrimary,
  DashboardPanel,
} from "@/features/builder/components/dashboard-ui"
import type { ThemeConfig } from "@/themes/engine/schema"

export const metadata = { title: "Template" }

export default async function AdminTemplatesPage() {
  await requireAdmin()
  const templates = await getAllTemplatesAdmin()

  const configEntries = await Promise.all(
    templates.map(async (template) => {
      const themeId = normalizeThemeSlug(template.slug)
      if (!themeId) return [template.id, null] as const
      const config = await getPlatformBaseConfig(themeId)
      return [template.id, config] as const
    }),
  )
  const configById = Object.fromEntries(configEntries) as Record<
    string,
    ThemeConfig | null
  >

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
        <DashboardPanel className="p-12 text-center">
          <p className="text-sm text-gray-400">Belum ada template.</p>
        </DashboardPanel>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <AdminTemplateCard
              key={template.id}
              template={template}
              themeConfig={configById[template.id]}
            />
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
