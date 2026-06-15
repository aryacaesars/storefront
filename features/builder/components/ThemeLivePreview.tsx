"use client"

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { templatePages } from "@/themes/engine/registry"
import { Header } from "@/themes/minimalist/sections/Header"
import { Footer } from "@/themes/minimalist/sections/Footer"
import { PreviewLinkGuard } from "@/features/builder/components/PreviewLinkGuard"
import type { ThemeConfig, TemplateId } from "@/themes/engine/schema"
import type { PreviewDevice } from "./EditorTopbar"

interface ThemeLivePreviewProps {
  templateId: TemplateId
  config: ThemeConfig
  device: PreviewDevice
  storefrontHost: string
}

export function ThemeLivePreview({
  templateId,
  config,
  device,
  storefrontHost,
}: ThemeLivePreviewProps) {
  const pages = templatePages[templateId as keyof typeof templatePages]

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-100">
      <div className="shrink-0 border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-[11px] text-amber-800">
        Preview mode — hanya homepage. Link dinonaktifkan; subdomain live:{" "}
        <span className="font-semibold">{storefrontHost}</span>
      </div>

      <div className="flex flex-1 items-start justify-center overflow-auto p-6">
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-300",
            device === "mobile" ? "w-[375px]" : "w-full max-w-5xl",
          )}
        >
          <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="mx-auto max-w-xs flex-1 truncate rounded-md border border-gray-200 bg-white px-3 py-1 text-center text-[10px] text-gray-400">
              {storefrontHost}
            </div>
          </div>

          {!pages ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center gap-2 px-8 text-center">
              <p className="text-sm font-semibold text-gray-900">Preview belum tersedia</p>
              <p className="text-xs text-gray-500">
                Template <span className="font-medium">{templateId}</span> masih dalam
                pengembangan. Aktifkan template ini dulu, lalu kembali setelah halaman
                theme-nya selesai.
              </p>
            </div>
          ) : (
            <PreviewLinkGuard>
              <ThemeProvider config={config}>
                <Header config={config} />
                <pages.HomePage config={config} />
                <Footer config={config} />
              </ThemeProvider>
            </PreviewLinkGuard>
          )}
        </div>
      </div>
    </div>
  )
}
