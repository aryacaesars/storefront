"use client"

import { useRef } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { isTemplateRegistered } from "@/themes/engine/registry"
import { ThemeFontScope } from "@/themes/engine/ThemeFontScope"
import { ThemeHomeView } from "@/themes/engine/ThemeHomeView"
import type { SectionEditorState } from "@/themes/engine/section-editor"
import { PreviewLinkGuard } from "@/features/builder/components/PreviewLinkGuard"
import { PreviewCanvas } from "@/features/builder/components/PreviewCanvas"
import type { ThemeConfig, TemplateId } from "@/themes/engine/schema"
import type { PreviewDevice } from "./EditorTopbar"
import type { PageType } from "@/themes/engine/resolve-page"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import { hrefToPageType } from "@/themes/engine/route-map"
import { PREVIEW_PAGE_SLUGS } from "@/themes/engine/page-props"
import { ThemeChromeView } from "@/themes/engine/ThemeChromeView"

interface ThemeLivePreviewProps {
  templateId: TemplateId
  config: ThemeConfig
  device: PreviewDevice
  storefrontHost: string
  selectedPage?: PageType
  onPageChange?: (page: PageType) => void
  sectionEditor?: SectionEditorState
  previewRootRef?: React.RefObject<HTMLDivElement | null>
}

const HREF_TO_PAGE: Partial<Record<string, PageType>> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/shop": "shop",
  "/collections": "collections",
  "/products": "productList",
  "/new-arrivals": "newArrivals",
  "/tech-series": "techSeries",
  "/all-products": "allProducts",
  "/cart": "cart",
  "/checkout": "checkout",
}

export function ThemeLivePreview({
  templateId,
  config,
  device,
  storefrontHost,
  selectedPage,
  onPageChange,
  sectionEditor,
  previewRootRef,
}: ThemeLivePreviewProps) {
  const fallbackRef = useRef<HTMLDivElement>(null)
  const scrollRootRef = previewRootRef ?? fallbackRef
  const ready = isTemplateRegistered(templateId)
  const isNonHomePage = Boolean(selectedPage && selectedPage !== "home")
  const PageComponent = isNonHomePage
    ? resolveThemePage(templateId, selectedPage!)
    : null

  function handlePreviewNavigate(href: string) {
    const pageType = hrefToPageType(href) ?? HREF_TO_PAGE[href.split("?")[0]]
    if (pageType && resolveThemePage(templateId, pageType)) {
      onPageChange?.(pageType)
    }
  }

  const pageBody = !ready ? (
    <div className="flex min-h-[480px] flex-col items-center justify-center gap-2 px-8 text-center">
      <p className="text-sm font-semibold text-gray-900">Preview belum tersedia</p>
      <p className="text-xs text-gray-500">
        Template <span className="font-medium">{templateId}</span> masih dalam
        pengembangan. Aktifkan template ini dulu, lalu kembali setelah halaman
        theme-nya selesai.
      </p>
    </div>
  ) : isNonHomePage ? (
    <PreviewLinkGuard onNavigate={handlePreviewNavigate}>
      <ThemeFontScope templateId={templateId}>
        <ThemeProvider config={config} forcedDevice={device}>
          {PageComponent ? (
            <ThemeChromeView config={config}>
              <PageComponent
                config={config}
                slug={
                  selectedPage
                    ? PREVIEW_PAGE_SLUGS[
                        selectedPage as keyof typeof PREVIEW_PAGE_SLUGS
                      ]
                    : undefined
                }
              />
            </ThemeChromeView>
          ) : (
            <div className="flex min-h-[480px] flex-col items-center justify-center gap-2 px-8 text-center">
              <p className="text-sm font-semibold text-gray-900">
                Halaman belum tersedia
              </p>
              <p className="text-xs text-gray-500">
                Halaman ini belum diimplementasi untuk template ini.
              </p>
            </div>
          )}
        </ThemeProvider>
      </ThemeFontScope>
    </PreviewLinkGuard>
  ) : (
    <PreviewLinkGuard onNavigate={handlePreviewNavigate}>
      <ThemeFontScope templateId={templateId}>
        <ThemeProvider config={config} forcedDevice={device}>
          <ThemeHomeView config={config} sectionEditor={sectionEditor} />
        </ThemeProvider>
      </ThemeFontScope>
    </PreviewLinkGuard>
  )

  const chrome = (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" />
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
      <div className="mx-auto min-w-0 max-w-xs flex-1 truncate rounded-md border border-gray-200 bg-white px-2 py-1 text-center text-[10px] text-gray-400">
        {storefrontHost}
      </div>
      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-600">
        {device === "mobile" ? "Mobile" : "Desktop"}
      </span>
    </div>
  )

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-100">
      <div className="shrink-0 border-b border-amber-100 bg-amber-50 px-4 py-2 text-center text-[11px] text-amber-800">
        Preview mode — navigasi terbatas ke halaman ter-wire; subdomain live:{" "}
        <span className="font-semibold">{storefrontHost}</span>
      </div>

      {/*
        previewRootRef wraps the canvas so section scroll can find
        [data-preview-viewport] + section nodes (see scrollPreviewIntoView).
      */}
      <div ref={scrollRootRef} className="flex min-h-0 flex-1 flex-col">
        <PreviewCanvas device={device} chrome={chrome}>
          {pageBody}
        </PreviewCanvas>
      </div>
    </div>
  )
}
