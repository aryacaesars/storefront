"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { EditorTopbar } from "./EditorTopbar"
import { ThemeLivePreview } from "./ThemeLivePreview"
import { ThemeSettingsPanel } from "./ThemeSettingsPanel"
import { ThemeSectionsPanel } from "./ThemeSectionsPanel"
import { publishTheme, saveThemeDraft } from "@/features/builder/actions/theme-actions"
import {
  heroConfigSchema,
  sectionPageTypeSchema,
  type HeroConfig,
  type SectionPageType,
  type TemplateId,
  type ThemeConfig,
} from "@/themes/engine/schema"
import type { PageType } from "@/themes/engine/resolve-page"
import { getImplementedPages } from "@/themes/engine/registry"
import { previewSectionDomId } from "@/themes/engine/section-editor"
import {
  applyPageTemplate,
  materializePageTemplate,
} from "@/themes/engine/page-template"
import { updateSectionBlocks } from "@/themes/engine/section-page-utils"
import { applyDevicePatch } from "@/themes/engine/device-settings"
import { DEFAULT_IMAGE_TRANSFORM } from "@/themes/bento/sections/category-grid-layout"

const DEFAULT_HERO: HeroConfig = heroConfigSchema.parse({})

type SidebarTab = "theme" | "sections" | "page"

// "about" removed: it now has section editing via sectionPageTypeSchema
const MARKETING_PAGE_TYPES: PageType[] = [
  "contact", "shop", "collections", "newArrivals", "techSeries", "allProducts",
]

function collectImageUrls(config: ThemeConfig): string[] {
  const urls: string[] = []
  if (config.heroImageUrl) urls.push(config.heroImageUrl)
  if (config.logoUrl) urls.push(config.logoUrl)

  for (const page of Object.values(config.templates ?? {})) {
    if (!page) continue
    for (const section of Object.values(page.sections)) {
      for (const block of section.blocks ?? []) {
        const url = block.settings?.imageUrl
        if (typeof url === "string" && url.trim()) urls.push(url)
      }
    }
  }

  return urls
}

interface CustomizeWorkspaceProps {
  storeId?: string
  templateId: TemplateId
  templateName: string
  initialConfig: ThemeConfig
  storefrontHost: string
  initialMode?: "edit" | "preview"
  onSaveDraft?: (config: ThemeConfig) => Promise<void>
  onPublish?: (config: ThemeConfig) => Promise<void>
}

export function CustomizeWorkspace({
  storeId,
  templateId,
  templateName,
  initialConfig,
  storefrontHost,
  initialMode = "edit",
  onSaveDraft,
  onPublish,
}: CustomizeWorkspaceProps) {
  const [mode, setMode] = useState<"edit" | "preview">(initialMode)
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [config, setConfig] = useState<ThemeConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [selectedPage, setSelectedPage] = useState<PageType>("home")
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("sections")
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const previewRootRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef(device)
  deviceRef.current = device

  const persistDraft = useCallback(async (next: ThemeConfig) => {
    setIsSaving(true)
    try {
      await (onSaveDraft ?? saveThemeDraft)(next)
      setStatus("Gambar tersimpan ke database.")
    } catch {
      setStatus("Gagal menyimpan gambar — coba Save Draft manual.")
    } finally {
      setIsSaving(false)
    }
  }, [onSaveDraft])

  const handleConfigChange = useCallback(
    (next: ThemeConfig) => {
      const prevUrls = new Set(collectImageUrls(config))
      const addedImage = collectImageUrls(next).some((url) => !prevUrls.has(url))
      setConfig(next)
      setStatus(null)
      if (addedImage) void persistDraft(next)
    },
    [config, persistDraft],
  )

  const availablePages = useMemo<PageType[]>(
    () => getImplementedPages(templateId),
    [templateId],
  )

  const showSectionsTab = (sectionPageTypeSchema.options as readonly string[]).includes(selectedPage)
  const isMarketingPage = MARKETING_PAGE_TYPES.includes(selectedPage)
  const isCatalogPage = !showSectionsTab && !isMarketingPage

  const handleSelectSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId)
    setSelectedBlockId(null)
    if (sectionId) {
      setSidebarTab("sections")
    }
  }, [])

  const handleSelectBlock = useCallback((sectionId: string, blockId: string | null) => {
    setSelectedSectionId(sectionId)
    setSelectedBlockId(blockId)
    setSidebarTab("sections")
  }, [])

  const handleBlockChange = useCallback(
    (pageType: SectionPageType, sectionId: string, blockId: string, patch: Record<string, unknown>) => {
      let nextConfig: ThemeConfig | null = null
      const mergedPatch =
        typeof patch.imageUrl === "string" && patch.imageUrl.trim()
          ? { ...DEFAULT_IMAGE_TRANSFORM, ...patch }
          : patch

      setConfig((prev) => {
        const template = materializePageTemplate(prev, pageType)
        const section = template.sections[sectionId]
        if (!section?.blocks) {
          return prev
        }

        const blocks = section.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                settings: applyDevicePatch(
                  block.settings ?? {},
                  mergedPatch,
                  deviceRef.current,
                ),
              }
            : block,
        )

        nextConfig = applyPageTemplate(
          prev,
          pageType,
          updateSectionBlocks(template, sectionId, blocks),
        )
        return nextConfig
      })

      const uploaded =
        typeof mergedPatch.imageUrl === "string" && mergedPatch.imageUrl.trim().length > 0
      if (uploaded && nextConfig) {
        void persistDraft(nextConfig)
      } else {
        setStatus(null)
      }
    },
    [persistDraft],
  )

  const sectionEditor = useMemo(() => {
    if (mode !== "edit" || !showSectionsTab) {
      return undefined
    }

    const pageType = selectedPage as SectionPageType

    return {
      selectedSectionId,
      selectedBlockId,
      pageType,
      onSelectSection: handleSelectSection,
      onSelectBlock: handleSelectBlock,
      onBlockChange: (sectionId: string, blockId: string, patch: Record<string, unknown>) =>
        handleBlockChange(pageType, sectionId, blockId, patch),
      onHeroChange: updateHero,
      previewSectionIdPrefix: "preview-section",
    }
  }, [
    mode,
    showSectionsTab,
    selectedPage,
    selectedSectionId,
    selectedBlockId,
    handleSelectSection,
    handleSelectBlock,
    handleBlockChange,
    updateHero,
  ])

  useEffect(() => {
    if (!availablePages.includes(selectedPage)) {
      setSelectedPage("home")
    }
  }, [availablePages, selectedPage])

  useEffect(() => {
    if (showSectionsTab) {
      setSidebarTab((t) => (t === "page" ? "sections" : t))
    } else if (MARKETING_PAGE_TYPES.includes(selectedPage)) {
      setSelectedSectionId(null)
      setSelectedBlockId(null)
      setSidebarTab("page")
    } else {
      setSelectedSectionId(null)
      setSelectedBlockId(null)
      setSidebarTab("theme")
    }
  }, [selectedPage, showSectionsTab])

  useEffect(() => {
    if (!selectedSectionId || !previewRootRef.current) {
      return
    }

    const domId = previewSectionDomId(
      { selectedSectionId, onSelectSection: setSelectedSectionId },
      selectedSectionId,
    )
    previewRootRef.current
      .querySelector(`#${domId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [selectedSectionId])

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

  async function handleSaveDraft() {
    setIsSaving(true)
    setStatus(null)
    try {
      await (onSaveDraft ?? saveThemeDraft)(config)
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
    setPaymentRequired(false)
    try {
      await (onPublish ?? publishTheme)(config)
      setStatus("Perubahan dipublish ke storefront live.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "PAYMENT_REQUIRED") {
        setPaymentRequired(true)
      } else {
        setStatus("Gagal publish perubahan.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {paymentRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Beli Template untuk Publish</h2>
            <p className="text-sm text-gray-500 mb-5">
              Kamu bisa edit template ini gratis, tapi untuk publish ke storefront perlu membeli lisensinya terlebih dahulu.
            </p>
            <div className="flex gap-3">
              {storeId && (
                <a
                  href={`/stores/${storeId}/templates`}
                  className="flex-1 py-2 px-4 bg-black text-white text-sm font-medium rounded-lg text-center hover:bg-gray-800 transition-colors"
                >
                  Beli Template
                </a>
              )}
              <button
                type="button"
                onClick={() => setPaymentRequired(false)}
                className="flex-1 py-2 px-4 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      )}
      <EditorTopbar
        templateName={templateName}
        mode={mode}
        device={device}
        onModeChange={setMode}
        onDeviceChange={setDevice}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        availablePages={availablePages}
        selectedPage={selectedPage}
        onPageChange={setSelectedPage}
      />

      {status && (
        <div className="shrink-0 border-b border-indigo-100 bg-indigo-50 px-4 py-2 text-center text-xs font-medium text-indigo-700">
          {status}
        </div>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {mode === "edit" && (
          <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
            {(showSectionsTab || isMarketingPage) && (
              <div className="flex shrink-0 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setSidebarTab("theme")}
                  className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors ${
                    sidebarTab === "theme"
                      ? "border-b-2 border-indigo-600 text-indigo-700"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Theme
                </button>
                {showSectionsTab && (
                  <button
                    type="button"
                    onClick={() => setSidebarTab("sections")}
                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors ${
                      sidebarTab === "sections"
                        ? "border-b-2 border-indigo-600 text-indigo-700"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Sections
                  </button>
                )}
                {isMarketingPage && (
                  <button
                    type="button"
                    onClick={() => setSidebarTab("page")}
                    className={`flex-1 px-3 py-2.5 text-xs font-semibold transition-colors ${
                      sidebarTab === "page"
                        ? "border-b-2 border-indigo-600 text-indigo-700"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Konten
                  </button>
                )}
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto">
              {sidebarTab === "sections" && showSectionsTab ? (
                <ThemeSectionsPanel
                  config={config}
                  selectedPage={selectedPage as SectionPageType}
                  onConfigChange={handleConfigChange}
                  onHeroChange={updateHero}
                  selectedSectionId={selectedSectionId}
                  selectedBlockId={selectedBlockId}
                  onSelectSection={handleSelectSection}
                  device={device}
                />
              ) : sidebarTab === "page" ? (
                <div className="flex flex-col gap-4 p-5">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Konten Halaman</h2>
                    <p className="mt-1 text-xs text-gray-400">
                      Edit teks, gambar, dan kartu untuk halaman ini.
                    </p>
                  </div>
                  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                    <p className="text-xs font-medium text-gray-500">
                      Editor konten halaman akan tersedia segera.
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                      Teks, gambar, dan kartu akan bisa diedit dari sini.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {isCatalogPage && (
                    <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
                      <p className="text-xs font-medium text-amber-800">
                        Halaman dikontrol katalog
                      </p>
                      <p className="mt-0.5 text-[11px] text-amber-700">
                        Data produk, harga, dan inventori ditarik dari katalog toko — tidak diedit di builder.
                      </p>
                    </div>
                  )}
                  <ThemeSettingsPanel
                    config={config}
                    onConfigChange={updateConfig}
                    onHeroChange={updateHero}
                  />
                </>
              )}
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0 overflow-hidden">
          <ThemeLivePreview
            templateId={templateId}
            config={config}
            device={device}
            storefrontHost={storefrontHost}
            selectedPage={selectedPage}
            onPageChange={setSelectedPage}
            sectionEditor={sectionEditor}
            previewRootRef={previewRootRef}
          />
        </div>
      </div>
    </div>
  )
}
