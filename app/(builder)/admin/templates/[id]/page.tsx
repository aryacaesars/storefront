import Link from "next/link"
import { notFound } from "next/navigation"
import { Paintbrush } from "lucide-react"
import { requireAdmin } from "@/features/auth/dal"
import { getTemplateById, normalizeThemeSlug } from "@/server/services/template.service"
import { getPlatformBaseConfig } from "@/server/services/platform-theme.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
  dashboardBtnPrimary,
} from "@/features/builder/components/dashboard-ui"
import { TemplateForm } from "../TemplateForm"
import { updateTemplateAction, deleteTemplateAction } from "./actions"

export const metadata = { title: "Edit Template" }

export default async function EditTemplatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const { error } = await searchParams
  const template = await getTemplateById(id)
  if (!template) notFound()

  const themeId = normalizeThemeSlug(template.slug)
  const baseThemeConfig = themeId ? await getPlatformBaseConfig(themeId) : null
  const update = updateTemplateAction.bind(null, id)

  return (
    <DashboardShell pageTitle="Edit Template" pageSubtitle={template.name}>
      <div className="flex flex-col gap-4">
        <Link href="/admin/templates" className={dashboardBackLink}>
          ← Kembali ke daftar template
        </Link>

        {themeId && (
          <DashboardPanel className="overflow-hidden p-0">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dash-primary-light text-dash-primary ring-1 ring-dash-primary/15">
                  <Paintbrush className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-dash-ink">Theme Builder</p>
                    <span className="rounded-full bg-dash-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dash-muted ring-1 ring-dash-border">
                      {themeId}
                    </span>
                  </div>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-dash-muted">
                    Edit tampilan default template. Dipakai store baru, thumbnail, dan halaman
                    /preview.
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/templates/${template.id}/builder`}
                className={`${dashboardBtnPrimary} shrink-0 self-start lg:self-center`}
              >
                Buka Theme Builder
              </Link>
            </div>
          </DashboardPanel>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <DashboardPanel className="p-6 lg:p-8">
          <TemplateForm
            action={update}
            baseThemeConfig={baseThemeConfig}
            submitLabel="Simpan Perubahan"
            defaultValues={{
              name: template.name,
              description: template.description ?? "",
              price: template.price,
              previewUrl: template.previewUrl ?? "",
              published: template.published,
            }}
          />
        </DashboardPanel>

        <DashboardPanel className="p-6">
          <p className="mb-3 text-sm font-semibold text-red-600">Zona Berbahaya</p>
          <form action={deleteTemplateAction.bind(null, id)}>
            <button
              type="submit"
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Hapus Template
            </button>
          </form>
          <p className="mt-2 text-xs text-dash-muted">
            Template yang sudah pernah dibeli tidak bisa dihapus.
          </p>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
