"use client"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { useMessages } from "@/features/i18n/LocaleProvider"

interface ImageUploadFieldProps {
  value: string | undefined
  placeholder: string
  onChange: (url: string | undefined) => void
  /** Optional store scope for upload path. */
  storeId?: string
}

export function ImageUploadField({
  value,
  placeholder,
  onChange,
  storeId,
}: ImageUploadFieldProps) {
  const t = useMessages().pages.builder.themeSettings.upload
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      if (storeId) form.append("storeId", storeId)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? t.failed)
      onChange(data.url as string)
    } catch (e) {
      setError(e instanceof Error ? e.message : t.failed)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
          e.target.value = ""
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            aria-label={t.removeImage}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 disabled:opacity-60"
      >
        <Upload className="h-4 w-4 text-gray-400" />
        {isUploading ? t.uploading : value ? t.replaceImage : placeholder}
      </button>

      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  )
}
