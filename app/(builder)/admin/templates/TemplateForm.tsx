"use client"

import { useActionState, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import type { TemplateFormState } from "./form-state"
import {
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"
import { cn } from "@/lib/utils"

function formatThousands(digits: string): string {
  if (!digits) return ""
  return Number(digits).toLocaleString("id-ID")
}

interface TemplateFormProps {
  action: (prev: TemplateFormState, formData: FormData) => Promise<TemplateFormState>
  defaultValues?: {
    name?: string
    description?: string
    price?: number
    previewUrl?: string
    published?: boolean
  }
  submitLabel: string
}

function PublishToggle({
  published,
  onChange,
}: {
  published: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      onClick={() => onChange(!published)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2",
        published ? "bg-brand" : "bg-gray-200",
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
          published ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  )
}

export function TemplateForm({ action, defaultValues = {}, submitLabel }: TemplateFormProps) {
  const [state, formAction, pending] = useActionState<TemplateFormState, FormData>(action, undefined)
  const [priceDigits, setPriceDigits] = useState(
    defaultValues.price != null ? String(defaultValues.price) : "",
  )
  const [previewUrl, setPreviewUrl] = useState(defaultValues.previewUrl ?? "")
  const [published, setPublished] = useState(defaultValues.published ?? false)
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
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="published" value={published ? "on" : ""} />
      <input type="hidden" name="previewUrl" value={previewUrl} />

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-5">
          <div>
            <label className={dashboardLabel}>
              Nama Template <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={defaultValues.name ?? ""}
              placeholder="Bold"
              className={dashboardInput}
            />
          </div>

          <div>
            <label className={dashboardLabel}>Deskripsi</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={defaultValues.description ?? ""}
              placeholder="Template modern untuk..."
              className={cn(dashboardInput, "resize-none")}
            />
          </div>

          <div>
            <label className={dashboardLabel}>
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input type="hidden" name="price" value={priceDigits} />
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={formatThousands(priceDigits)}
                onChange={(e) => setPriceDigits(e.target.value.replace(/\D/g, ""))}
                placeholder="0"
                className={cn(dashboardInput, "pl-9")}
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-400">Isi 0 untuk template gratis.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">Status Marketplace</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {published
                    ? "Terbit — tampil di marketplace untuk dibeli merchant."
                    : "Draft — disimpan tapi tidak tampil di marketplace."}
                </p>
              </div>
              <PublishToggle published={published} onChange={setPublished} />
            </div>
            <p
              className={cn(
                "mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                published ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600",
              )}
            >
              {published ? "Terbit" : "Draft"}
            </p>
          </div>

          <div>
            <label className={dashboardLabel}>Preview</label>
            {previewUrl ? (
              <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview template" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewUrl("")}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-brand/40 hover:bg-brand/5">
                <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Upload preview</span>
                <span className="mt-1 text-xs text-gray-400">PNG, JPG, WebP</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && <p className="mt-2 text-xs text-gray-500">Mengupload...</p>}
            {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <button type="submit" disabled={pending || uploading} className={dashboardBtnPrimary}>
          {pending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
