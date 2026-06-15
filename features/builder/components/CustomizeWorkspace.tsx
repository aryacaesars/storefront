"use client"

import { useMemo, useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { EditorTopbar } from "./EditorTopbar"
import { ThemeLivePreview } from "./ThemeLivePreview"
import {
  SettingsField,
  SettingsInput,
  SettingsTextarea,
} from "@/features/builder/components/SettingsSection"
import { publishTheme, saveThemeDraft } from "@/features/builder/actions/theme-actions"
import {
  BODY_FONT_OPTIONS,
  fontCssToLabel,
  fontLabelToCss,
  HEADING_FONT_OPTIONS,
} from "@/lib/themes/fonts"
import {
  heroConfigSchema,
  type HeroConfig,
  type TemplateId,
  type ThemeConfig,
} from "@/themes/engine/schema"

/** Nilai default hero (align/tone/size) hasil parse schema kosong. */
const DEFAULT_HERO: HeroConfig = heroConfigSchema.parse({})

interface CustomizeWorkspaceProps {
  templateId: TemplateId
  templateName: string
  initialConfig: ThemeConfig
  storefrontHost: string
  initialMode?: "edit" | "preview"
}

export function CustomizeWorkspace({
  templateId,
  templateName,
  initialConfig,
  storefrontHost,
  initialMode = "edit",
}: CustomizeWorkspaceProps) {
  const [mode, setMode] = useState<"edit" | "preview">(initialMode)
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [config, setConfig] = useState<ThemeConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const headingFontLabel = useMemo(
    () => fontCssToLabel(config.headingFont),
    [config.headingFont],
  )
  const bodyFontLabel = useMemo(
    () => fontCssToLabel(config.bodyFont),
    [config.bodyFont],
  )

  function updateConfig<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setStatus(null)
  }

  function updateHero<K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...DEFAULT_HERO, ...prev.hero, [key]: value },
    }))
    setStatus(null)
  }

  const hero = { ...DEFAULT_HERO, ...config.hero }


  async function handleSaveDraft() {
    setIsSaving(true)
    setStatus(null)
    try {
      await saveThemeDraft(config)
      setStatus("Draft tersimpan.")
    } catch {
      setStatus("Gagal menyimpan draft.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handlePublish() {
    setIsSaving(true)
    setStatus(null)
    try {
      await publishTheme(config)
      setStatus("Perubahan dipublish ke storefront live.")
    } catch {
      setStatus("Gagal publish perubahan.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorTopbar
        templateName={templateName}
        mode={mode}
        device={device}
        onModeChange={setMode}
        onDeviceChange={setDevice}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
      />

      {status && (
        <div className="shrink-0 border-b border-indigo-100 bg-indigo-50 px-4 py-2 text-center text-xs font-medium text-indigo-700">
          {status}
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {mode === "edit" && (
          <aside className="w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
            <div className="p-5 flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Branding</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Perubahan langsung terlihat di preview theme{" "}
                  <span className="font-medium text-gray-600">{templateName}</span>.
                </p>
              </div>

              <SettingsField label="Nama Toko">
                <SettingsInput
                  value={config.storeName}
                  onChange={(e) => updateConfig("storeName", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Tagline" hint="Teks pendukung di footer storefront.">
                <SettingsInput
                  value={config.tagline ?? ""}
                  onChange={(e) => updateConfig("tagline", e.target.value)}
                />
              </SettingsField>

              <SettingsField
                label="Banner Pengumuman"
                hint="Teks bar di bagian atas storefront."
              >
                <SettingsTextarea
                  rows={2}
                  value={config.bannerText}
                  onChange={(e) => updateConfig("bannerText", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Logo Toko" hint="PNG, SVG, atau WebP. Maks. 2MB.">
                <ImageUploadField
                  value={config.logoUrl}
                  placeholder="Upload Logo"
                  onChange={(url) => updateConfig("logoUrl", url)}
                />
              </SettingsField>

              <SettingsField
                label="Tampilan Brand"
                hint="Yang ditampilkan di header. Tanpa logo, nama toko selalu dipakai."
              >
                <SegmentedControl
                  value={config.logoDisplay ?? "logo"}
                  options={[
                    { value: "logo", label: "Logo" },
                    { value: "text", label: "Teks" },
                    { value: "both", label: "Keduanya" },
                  ]}
                  onChange={(v) => updateConfig("logoDisplay", v)}
                />
              </SettingsField>

              <SettingsField
                label="Gambar Hero"
                hint="Banner besar di halaman utama. Maks. 2MB."
              >
                <ImageUploadField
                  value={config.heroImageUrl}
                  placeholder="Upload Gambar Hero"
                  onChange={(url) => updateConfig("heroImageUrl", url)}
                />
              </SettingsField>

              <div className="border-t border-gray-100 pt-5">
                <h2 className="text-sm font-semibold text-gray-900">Teks Hero</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Judul, posisi, dan gaya teks di banner utama.
                </p>
              </div>

              <SettingsField label="Judul">
                <SettingsTextarea
                  rows={2}
                  value={hero.title ?? ""}
                  placeholder="Quiet Luxury for the Modern Individual"
                  onChange={(e) => updateHero("title", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Subjudul">
                <SettingsTextarea
                  rows={3}
                  value={hero.subtitle ?? ""}
                  placeholder="Curated essentials designed with intention…"
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Posisi Teks">
                <SegmentedControl
                  value={hero.align}
                  options={[
                    { value: "left", label: "Kiri" },
                    { value: "center", label: "Tengah" },
                  ]}
                  onChange={(v) => updateHero("align", v)}
                />
              </SettingsField>

              <SettingsField
                label="Warna Teks"
                hint="Terang untuk foto gelap, gelap untuk foto terang."
              >
                <SegmentedControl
                  value={hero.textTone}
                  options={[
                    { value: "dark", label: "Gelap" },
                    { value: "light", label: "Terang" },
                  ]}
                  onChange={(v) => updateHero("textTone", v)}
                />
              </SettingsField>

              <SettingsField label="Ukuran Judul">
                <SegmentedControl
                  value={hero.titleSize}
                  options={[
                    { value: "sm", label: "S" },
                    { value: "md", label: "M" },
                    { value: "lg", label: "L" },
                  ]}
                  onChange={(v) => updateHero("titleSize", v)}
                />
              </SettingsField>

              <SettingsField label="Teks Tombol">
                <SettingsInput
                  value={hero.ctaLabel ?? ""}
                  placeholder="Shop Collection"
                  onChange={(e) => updateHero("ctaLabel", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Warna Utama">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shrink-0">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig("primaryColor", e.target.value)}
                      className="absolute inset-0 w-14 h-14 -translate-x-2 -translate-y-2 cursor-pointer opacity-0"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  </div>
                  <SettingsInput
                    value={config.primaryColor}
                    onChange={(e) => updateConfig("primaryColor", e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
              </SettingsField>

              <SettingsField label="Tipografi">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1.5">Heading</p>
                    <select
                      value={headingFontLabel}
                      onChange={(e) =>
                        updateConfig("headingFont", fontLabelToCss(e.target.value))
                      }
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    >
                      {HEADING_FONT_OPTIONS.map((font) => (
                        <option key={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1.5">Body</p>
                    <select
                      value={bodyFontLabel}
                      onChange={(e) =>
                        updateConfig("bodyFont", fontLabelToCss(e.target.value))
                      }
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    >
                      {BODY_FONT_OPTIONS.map((font) => (
                        <option key={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </SettingsField>
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0 overflow-hidden">
          <ThemeLivePreview
            templateId={templateId}
            config={config}
            device={device}
            storefrontHost={storefrontHost}
          />
        </div>
      </div>
    </div>
  )
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-8 flex-1 rounded-md text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

interface ImageUploadFieldProps {
  value: string | undefined
  placeholder: string
  onChange: (url: string | undefined) => void
}

function ImageUploadField({ value, placeholder, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setIsUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Upload gagal")
      onChange(data.url as string)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal")
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
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75 transition-colors"
            aria-label="Hapus gambar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-xs font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-60"
      >
        <Upload className="w-4 h-4 text-gray-400" />
        {isUploading ? "Mengupload..." : value ? "Ganti Gambar" : placeholder}
      </button>

      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  )
}
