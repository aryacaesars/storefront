import Link from "next/link"
import { requireAdmin } from "@/features/auth/dal"
import { TemplateForm } from "../TemplateForm"
import { createTemplateAction } from "./actions"

export const metadata = { title: "Admin — Tambah Template" }

export default async function NewTemplatePage() {
  await requireAdmin()
  return (
    <div className="p-6 max-w-lg">
      <Link href="/admin/templates" className="text-sm text-gray-400 hover:text-gray-700">← Kembali</Link>
      <h1 className="mt-4 mb-6 text-2xl font-semibold text-gray-900">Tambah Template</h1>
      <TemplateForm action={createTemplateAction} submitLabel="Buat Template" />
    </div>
  )
}
