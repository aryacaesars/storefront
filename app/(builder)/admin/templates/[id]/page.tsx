import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/features/auth/dal"
import { getTemplateById } from "@/server/services/template.service"
import { DashboardShell } from "@/features/builder/components/DashboardShell"
import {
  DashboardPanel,
  dashboardBackLink,
} from "@/features/builder/components/dashboard-ui"
import { TemplateForm } from "../TemplateForm"
import { updateTemplateAction, deleteTemplateAction } from "./actions"

export const metadata = { title: "Admin — Edit Template" }

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

  const update = updateTemplateAction.bind(null, id)

  return (
    <DashboardShell
      pageTitle="Edit Template"
      pageSubtitle={template.name}
    >
      <div className="flex flex-col gap-4">
        <Link href="/admin/templates" className={dashboardBackLink}>
          ← Kembali ke daftar template
        </Link>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <DashboardPanel className="p-6 lg:p-8">
          <TemplateForm
            action={update}
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
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Hapus Template
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-400">
            Template yang sudah pernah dibeli tidak bisa dihapus.
          </p>
        </DashboardPanel>
      </div>
    </DashboardShell>
  )
}
