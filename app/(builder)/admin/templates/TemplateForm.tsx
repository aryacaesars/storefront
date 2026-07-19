"use client"

import { useActionState, useState } from "react"
import { ImagePlus, RefreshCw, Upload, X } from "lucide-react"
import type { TemplateFormState } from "./form-state"
import {
  dashboardBtnOutline,
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from "@/features/builder/components/dashboard-ui"
import { ThemeHeroThumbnail } from "@/features/builder/components/ThemeHeroThumbnail"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/themes/engine/schema"

/** Rasio kartu marketplace (16:10). */
const PREVIEW_ASPECT = "aspect-[16/10]"
/** Ukuran upload yang disarankan agar tajam di kartu. */
const PREVIEW_SIZE_HINT = "1200 × 750 px (rasio 16:10)"

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
  /** Config base platform — dipakai render thumbnail live bila belum upload gambar. */
  baseThemeConfig?: ThemeConfig | null
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
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-dash-primary/30 focus:ring-offset-2",
        published ? "bg-dash-primary" : "bg-dash-border",
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

export function TemplateForm({
  action,
  defaultValues = {},
  baseThemeConfig = null,
  submitLabel,
}: TemplateFormProps) {
  const [state, formAction, pending] = useActionState<TemplateFormState, FormData>(
    action,
    undefined,
  )
  const [priceDigits, setPriceDigits] = useState(
    defaultValues.price != null ? String(defaultValues.price) : "",
  )
  const [previewUrl, setPreviewUrl] = useState(defaultValues.previewUrl ?? "")
  const [published, setPublished] = useState(defaultValues.published ?? false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const hasCustomPreview = Boolean(previewUrl)
  const showLiveThumb = !hasCustomPreview && Boolean(baseThemeConfig)

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
      e.target.value = ""
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="published" value={published ? "on" : ""} />
      <input type="hidden" name="previewUrl" value={previewUrl} />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
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
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-dash-muted">
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
            <p className="mt-1.5 text-xs text-dash-muted">Isi 0 untuk template gratis.</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-dash-border bg-dash-bg/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-dash-ink">Status Marketplace</p>
                <p className="mt-1 text-xs leading-relaxed text-dash-muted">
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
                published
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-dash-border/60 text-dash-muted",
              )}
            >
              {published ? "Terbit" : "Draft"}
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-dash-ink">Preview kartu</label>
              {hasCustomPreview ? (
                <span className="rounded-full bg-dash-primary-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dash-primary">
                  Gambar kustom
                </span>
              ) : showLiveThumb ? (
                <span className="rounded-full bg-dash-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dash-muted ring-1 ring-dash-border">
                  Live dari base
                </span>
              ) : null}
            </div>

            <div
              className={cn(
                "group relative w-full overflow-hidden rounded-2xl border border-dash-border bg-dash-bg",
                PREVIEW_ASPECT,
              )}
            >
              {hasCustomPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview template"
                  className="h-full w-full object-cover object-top"
                />
              ) : showLiveThumb && baseThemeConfig ? (
                <ThemeHeroThumbnail
                  config={baseThemeConfig}
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <ImagePlus className="h-8 w-8 text-dash-muted/50" />
                  <p className="text-sm font-medium text-dash-muted">Belum ada preview</p>
                </div>
              )}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-dash-muted">
              Default menampilkan render hero dari{" "}
              <span className="font-medium text-dash-ink">base template</span>. Upload gambar
              sendiri jika ingin override. Rekomendasi:{" "}
              <span className="font-medium text-dash-ink">{PREVIEW_SIZE_HINT}</span> · PNG, JPG,
              WebP.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <label
                className={cn(
                  dashboardBtnOutline,
                  "cursor-pointer py-2 text-xs",
                  uploading && "pointer-events-none opacity-50",
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Mengupload..." : hasCustomPreview ? "Ganti gambar" : "Upload gambar"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>

              {hasCustomPreview && (
                <button
                  type="button"
                  onClick={() => setPreviewUrl("")}
                  className={cn(dashboardBtnOutline, "py-2 text-xs text-dash-muted")}
                >
                  {baseThemeConfig ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Pakai live base
                    </>
                  ) : (
                    <>
                      <X className="h-3.5 w-3.5" />
                      Hapus
                    </>
                  )}
                </button>
              )}
            </div>

            {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-dash-border pt-6">
        <button type="submit" disabled={pending || uploading} className={dashboardBtnPrimary}>
          {pending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
