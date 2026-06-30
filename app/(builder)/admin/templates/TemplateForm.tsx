"use client"

import { useActionState, useState } from "react"
import type { TemplateFormState } from "./form-state"

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-colors focus:border-gray-900 placeholder:text-gray-400"

interface TemplateFormProps {
  action: (prev: TemplateFormState, formData: FormData) => Promise<TemplateFormState>
  defaultValues?: {
    name?: string
    description?: string
    priceDollars?: string
    previewUrl?: string
    published?: boolean
  }
  submitLabel: string
}

export function TemplateForm({ action, defaultValues = {}, submitLabel }: TemplateFormProps) {
  const [state, formAction, pending] = useActionState<TemplateFormState, FormData>(action, undefined)
  const [previewUrl, setPreviewUrl] = useState(defaultValues.previewUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("upload failed")
      const data = (await res.json()) as { url: string }
      setPreviewUrl(data.url)
    } catch {
      setUploadError("Gagal upload gambar.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-5 max-w-lg">
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Template</label>
        <input name="name" type="text" required defaultValue={defaultValues.name ?? ""} className={inputClass} placeholder="Bold" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
        <textarea name="description" rows={3} defaultValue={defaultValues.description ?? ""} className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 placeholder:text-gray-400" placeholder="Template modern untuk..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Harga (USD)</label>
        <input name="price" type="number" step="0.01" min="0" required defaultValue={defaultValues.priceDollars ?? "0"} className={inputClass} placeholder="29.99" />
        <p className="mt-1 text-xs text-gray-400">Isi 0 untuk template gratis.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview</label>
        <input type="hidden" name="previewUrl" value={previewUrl} />
        {previewUrl ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="h-32 rounded-lg border border-gray-200 object-cover" />
            <button type="button" onClick={() => setPreviewUrl("")} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-900 text-white text-xs">✕</button>
          </div>
        ) : (
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} disabled={uploading} className="block text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200" />
        )}
        {uploading && <p className="mt-1 text-xs text-gray-400">Mengupload...</p>}
        {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
      </div>

      <label className="flex items-center gap-2">
        <input name="published" type="checkbox" defaultChecked={defaultValues.published ?? false} className="h-4 w-4 rounded border-gray-300" />
        <span className="text-sm text-gray-700">Terbitkan ke marketplace</span>
      </label>

      <button type="submit" disabled={pending || uploading} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50">
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  )
}
