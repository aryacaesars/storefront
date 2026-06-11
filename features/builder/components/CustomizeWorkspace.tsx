"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { EditorTopbar } from "./EditorTopbar"
import { StorefrontPreview, type BrandingConfig } from "./StorefrontPreview"
import {
  SettingsField,
  SettingsInput,
  SettingsTextarea,
} from "@/features/builder/components/SettingsSection"

const DEFAULT_BRANDING: BrandingConfig = {
  storeName: "Nama Toko Saya",
  primaryColor: "#4F46E5",
  headingFont: "Inter",
  bodyFont: "Inter",
  bannerText: "Gratis ongkir untuk pembelian di atas Rp 200.000",
}

interface CustomizeWorkspaceProps {
  templateName: string
  initialMode?: "edit" | "preview"
}

export function CustomizeWorkspace({
  templateName,
  initialMode = "edit",
}: CustomizeWorkspaceProps) {
  const [mode, setMode] = useState<"edit" | "preview">(initialMode)
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  function updateBranding<K extends keyof BrandingConfig>(key: K, value: BrandingConfig[K]) {
    setBranding((prev) => ({ ...prev, [key]: value }))
    setStatus(null)
  }

  async function handleSaveDraft() {
    setIsSaving(true)
    setStatus(null)
    // TODO: POST /api/themes — simpan draft ke DB
    await new Promise((r) => setTimeout(r, 600))
    setIsSaving(false)
    setStatus("Draft tersimpan.")
  }

  async function handlePublish() {
    setIsSaving(true)
    setStatus(null)
    // TODO: POST /api/themes/publish — push ke subdomain live
    await new Promise((r) => setTimeout(r, 800))
    setIsSaving(false)
    setStatus("Perubahan dipublish ke storefront live.")
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh)] overflow-hidden">
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
                  Perubahan langsung terlihat di preview.
                </p>
              </div>

              <SettingsField label="Nama Toko">
                <SettingsInput
                  value={branding.storeName}
                  onChange={(e) => updateBranding("storeName", e.target.value)}
                />
              </SettingsField>

              <SettingsField
                label="Banner Pengumuman"
                hint="Teks bar di bagian atas storefront."
              >
                <SettingsTextarea
                  rows={2}
                  value={branding.bannerText}
                  onChange={(e) => updateBranding("bannerText", e.target.value)}
                />
              </SettingsField>

              <SettingsField label="Logo Toko" hint="PNG, SVG, atau WebP. Maks. 2MB.">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-xs font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-400" />
                  Upload Logo
                </button>
              </SettingsField>

              <SettingsField label="Warna Utama">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 cursor-pointer shrink-0">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => updateBranding("primaryColor", e.target.value)}
                      className="absolute inset-0 w-14 h-14 -translate-x-2 -translate-y-2 cursor-pointer opacity-0"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: branding.primaryColor }}
                    />
                  </div>
                  <SettingsInput
                    value={branding.primaryColor}
                    onChange={(e) => updateBranding("primaryColor", e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
              </SettingsField>

              <SettingsField label="Tipografi">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1.5">Heading</p>
                    <select
                      value={branding.headingFont}
                      onChange={(e) => updateBranding("headingFont", e.target.value)}
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    >
                      {["Inter", "Geist", "Playfair Display", "Lora", "DM Serif Display"].map(
                        (font) => (
                          <option key={font}>{font}</option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1.5">Body</p>
                    <select
                      value={branding.bodyFont}
                      onChange={(e) => updateBranding("bodyFont", e.target.value)}
                      className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                    >
                      {["Inter", "Geist", "Plus Jakarta Sans", "DM Sans"].map((font) => (
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
          <StorefrontPreview branding={branding} device={device} />
        </div>
      </div>
    </div>
  )
}
