import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/features/auth/dal"
import { getTemplateById } from "@/server/services/template.service"
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
    <div className="p-6 max-w-lg">
      <Link href="/admin/templates" className="text-sm text-gray-400 hover:text-gray-700">← Kembali</Link>
      <h1 className="mt-4 mb-6 text-2xl font-semibold text-gray-900">Edit Template</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <TemplateForm
        action={update}
        submitLabel="Simpan Perubahan"
        defaultValues={{
          name: template.name,
          description: template.description ?? "",
          priceDollars: (template.price / 100).toFixed(2),
          previewUrl: template.previewUrl ?? "",
          published: template.published,
        }}
      />

      <div className="mt-8 pt-5 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-3">Zona Berbahaya</p>
        <form action={deleteTemplateAction.bind(null, id)}>
          <button type="submit" className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Hapus Template
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-400">Template yang sudah pernah dibeli tidak bisa dihapus.</p>
      </div>
    </div>
  )
}
