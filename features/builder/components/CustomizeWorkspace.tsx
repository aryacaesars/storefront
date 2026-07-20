"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { EditorTopbar } from "./EditorTopbar"
import { ThemeLivePreview } from "./ThemeLivePreview"
import { scrollPreviewIntoView } from "./PreviewCanvas"
import { BuilderToolRail, BUILDER_TOOLS, type BuilderTool } from "./BuilderToolRail"
import { BuilderToolPanels } from "./BuilderToolPanels"
import { BuilderMobileNav } from "./BuilderMobileNav"
import { BuilderMobileSheet } from "./BuilderMobileSheet"
import { CanvasElementToolbar } from "./CanvasElementToolbar"
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
import {
  previewSectionDomId,
  type SelectedElement,
} from "@/themes/engine/section-editor"
import {
  applyPageTemplate,
  hasDefaultPageTemplate,
  materializePageTemplate,
  resetPageLayouts,
} from "@/themes/engine/page-template"
import {
  updateSectionBlocks,
  updateSectionSettings,
} from "@/themes/engine/section-page-utils"
import { applyDevicePatch } from "@/themes/engine/device-settings"
import { DEFAULT_IMAGE_TRANSFORM } from "@/themes/bento/sections/category-grid-layout"

const DEFAULT_HERO: HeroConfig = heroConfigSchema.parse({})

// "about" removed: it now has section editing via sectionPageTypeSchema
const MARKETING_PAGE_TYPES: PageType[] = [
  "contact", "shop", "collections", "newArrivals", "techSeries",
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
  const [activeTool, setActiveTool] = useState<BuilderTool>("sections")
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const [isNarrowViewport, setIsNarrowViewport] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [croppingKey, setCroppingKey] = useState<string | null>(null)
  const [copiedTextStyle, setCopiedTextStyle] = useState<Record<string, unknown> | null>(null)
  const previewRootRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef(device)
  deviceRef.current = device

  // Mobile chrome (< md): track viewport for layout only — device stays desktop by default.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => setIsNarrowViewport(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // Lock browser page-zoom so topbar / navbar stay fixed; only the canvas zooms.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const target = e.target as HTMLElement | null
      if (target?.closest("[data-preview-viewport]")) return
      e.preventDefault()
    }
    const onGesture = (e: Event) => e.preventDefault()

    document.addEventListener("wheel", onWheel, { passive: false })
    document.addEventListener("gesturestart", onGesture)
    document.addEventListener("gesturechange", onGesture)
    document.addEventListener("gestureend", onGesture)
    return () => {
      document.removeEventListener("wheel", onWheel)
      document.removeEventListener("gesturestart", onGesture)
      document.removeEventListener("gesturechange", onGesture)
      document.removeEventListener("gestureend", onGesture)
    }
  }, [])

  const persistDraft = useCallback(async (next: ThemeConfig) => {
    setIsSaving(true)
    try {
      await (onSaveDraft ?? saveThemeDraft)(next)
      setStatus("Image saved to database.")
    } catch {
      setStatus("Failed to save image — try Save Draft manually.")
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

  const showSectionsTab =
    (sectionPageTypeSchema.options as readonly string[]).includes(selectedPage) &&
    hasDefaultPageTemplate(templateId, selectedPage as SectionPageType)
  const isMarketingPage = MARKETING_PAGE_TYPES.includes(selectedPage)
  const isCatalogPage = !showSectionsTab && !isMarketingPage

  const handleSelectSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId)
    setSelectedBlockId(null)
    setSelectedElement(null)
    setCroppingKey(null)
  }, [])

  const handleSelectBlock = useCallback((sectionId: string, blockId: string | null) => {
    setSelectedSectionId(sectionId)
    setSelectedBlockId(blockId)
    // Element selection survives only while it still points at this block —
    // onSelectElement (fired right after) re-selects the new element.
    setSelectedElement((prev) =>
      prev && prev.sectionId === sectionId && prev.blockId === blockId ? prev : null,
    )
    setCroppingKey((prev) =>
      prev && blockId && prev.split("|")[2] === blockId ? prev : null,
    )
  }, [])

  const handleSelectElement = useCallback((element: SelectedElement | null) => {
    setSelectedElement(element)
    setCroppingKey((prev) => {
      if (!prev) return prev
      if (!element) return null
      const [, sectionId, blockId, itemId] = prev.split("|")
      return element.sectionId === sectionId &&
        element.blockId === blockId &&
        (element.itemId ?? "") === itemId
        ? prev
        : null
    })
  }, [])

  const patchSectionSetting = useCallback(
    (sectionId: string, key: string, value: string | undefined) => {
      const pageType = selectedPage as SectionPageType
      setConfig((prev) => {
        const template = materializePageTemplate(prev, pageType)
        const section = template.sections[sectionId]
        if (!section) return prev
        const nextSettings = { ...(section.settings ?? {}) }
        if (value === undefined || value === "") {
          delete nextSettings[key]
        } else {
          nextSettings[key] = value
        }
        return applyPageTemplate(
          prev,
          pageType,
          updateSectionSettings(template, sectionId, nextSettings),
        )
      })
      setStatus(null)
    },
    [selectedPage],
  )

  const patchSectionSettings = useCallback(
    (sectionId: string, patch: Record<string, unknown>) => {
      const pageType = selectedPage as SectionPageType
      setConfig((prev) => {
        const template = materializePageTemplate(prev, pageType)
        const section = template.sections[sectionId]
        if (!section) return prev
        return applyPageTemplate(
          prev,
          pageType,
          updateSectionSettings(template, sectionId, {
            ...(section.settings ?? {}),
            ...patch,
          }),
        )
      })
      setStatus(null)
    },
    [selectedPage],
  )

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

  const patchBlockSetting = useCallback(
    (sectionId: string, blockId: string, key: string, value: string | number | undefined) => {
      handleBlockChange(
        selectedPage as SectionPageType,
        sectionId,
        blockId,
        { [key]: value ?? "" },
      )
    },
    [handleBlockChange, selectedPage],
  )

  const patchBlock = useCallback(
    (sectionId: string, blockId: string, patch: Record<string, unknown>) => {
      handleBlockChange(
        selectedPage as SectionPageType,
        sectionId,
        blockId,
        patch,
      )
    },
    [handleBlockChange, selectedPage],
  )

  const reorderBlocks = useCallback(
    (sectionId: string, fromIndex: number, toIndex: number) => {
      const pageType = selectedPage as SectionPageType
      setConfig((prev) => {
        const template = materializePageTemplate(prev, pageType)
        const section = template.sections[sectionId]
        const blocks = section?.blocks
        if (!blocks || fromIndex === toIndex) return prev
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= blocks.length ||
          toIndex >= blocks.length
        ) {
          return prev
        }
        const next = [...blocks]
        const [moved] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, moved)
        return applyPageTemplate(
          prev,
          pageType,
          updateSectionBlocks(template, sectionId, next),
        )
      })
      setStatus(null)
    },
    [selectedPage],
  )

  const sectionEditor = useMemo(() => {
    if (mode !== "edit" || !showSectionsTab) {
      return undefined
    }

    const pageType = selectedPage as SectionPageType

    return {
      selectedSectionId,
      selectedBlockId,
      selectedElement,
      croppingElementKey: croppingKey,
      pageType,
      onSelectSection: handleSelectSection,
      onSelectBlock: handleSelectBlock,
      onSelectElement: handleSelectElement,
      onBlockChange: (sectionId: string, blockId: string, patch: Record<string, unknown>) =>
        handleBlockChange(pageType, sectionId, blockId, patch),
      onHeroChange: updateHero,
      onSectionSettingsChange: patchSectionSettings,
      previewSectionIdPrefix: "preview-section",
    }
  }, [
    mode,
    showSectionsTab,
    selectedPage,
    selectedSectionId,
    selectedBlockId,
    selectedElement,
    croppingKey,
    handleSelectSection,
    handleSelectBlock,
    handleSelectElement,
    handleBlockChange,
    updateHero,
    patchSectionSettings,
  ])

  useEffect(() => {
    if (!availablePages.includes(selectedPage)) {
      setSelectedPage("home")
    }
  }, [availablePages, selectedPage])

  const clearElementSelection = useCallback(() => {
    setSelectedElement(null)
    setCroppingKey(null)
  }, [])

  const handlePageChange = useCallback((page: PageType) => {
    setSelectedPage(page)
    clearElementSelection()
  }, [clearElementSelection])

  const handleModeChange = useCallback((next: "edit" | "preview") => {
    setMode(next)
    clearElementSelection()
    if (next === "preview") setMobilePanelOpen(false)
  }, [clearElementSelection])

  const handleDeviceChange = useCallback((next: "desktop" | "mobile") => {
    setDevice(next)
    clearElementSelection()
  }, [clearElementSelection])

  useEffect(() => {
    if (showSectionsTab) {
      setActiveTool((t) => (t === "page" ? "sections" : t))
    } else if (MARKETING_PAGE_TYPES.includes(selectedPage)) {
      setSelectedSectionId(null)
      setSelectedBlockId(null)
      setActiveTool("page")
    } else {
      setSelectedSectionId(null)
      setSelectedBlockId(null)
      setActiveTool("theme")
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
    const el = previewRootRef.current.querySelector<HTMLElement>(`#${domId}`)
    if (!el) return
    // CSS scale breaks native scrollIntoView — scroll the preview viewport manually.
    scrollPreviewIntoView(previewRootRef.current, el, {
      behavior: "smooth",
      block: "center",
    })
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
      setStatus("Draft saved.")
    } catch {
      setStatus("Failed to save draft.")
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
      setStatus("Changes published to the Live Store.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      if (msg === "PAYMENT_REQUIRED") {
        setPaymentRequired(true)
      } else {
        setStatus("Failed to publish changes.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  async function handleResetLayout() {
    const confirmed = window.confirm(
      "Homepage/about layout will reset to default. Logo and colors will be kept. Continue?",
    )
    if (!confirmed) return

    const next = resetPageLayouts(config)
    setConfig(next)
    setSelectedSectionId(null)
    setSelectedBlockId(null)
    setSelectedElement(null)
    setCroppingKey(null)
    setStatus(null)
    setIsSaving(true)
    try {
      await (onSaveDraft ?? saveThemeDraft)(next)
      setStatus("Layout reset to default. Click Publish to show on the storefront.")
    } catch {
      setStatus("Failed to save layout reset.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleMobileToolChange = useCallback((tool: BuilderTool) => {
    setActiveTool((prev) => {
      if (prev === tool) {
        setMobilePanelOpen((open) => !open)
        return prev
      }
      setMobilePanelOpen(true)
      return tool
    })
  }, [])

  const openMobileTool = useCallback((tool: BuilderTool) => {
    setActiveTool(tool)
    setMobilePanelOpen(true)
  }, [])

  const activeToolLabel =
    BUILDER_TOOLS.find((t) => t.id === activeTool)?.label ?? "Tools"

  const toolPanelProps = {
    activeTool,
    config,
    selectedPage: selectedPage as SectionPageType,
    device,
    showSectionsTab,
    isCatalogPage,
    selectedSectionId,
    selectedBlockId,
    selectedElement,
    onConfigChange: handleConfigChange,
    onSelectSection: handleSelectSection,
    onSelectBlock: handleSelectBlock,
    onSelectElement: handleSelectElement,
    onPatchBlock: patchBlock,
    onUpdateBlockSetting: patchBlockSetting,
    onUpdateSectionSetting: patchSectionSetting,
    onReorderBlocks: reorderBlocks,
    onConfigKeyChange: updateConfig,
    onHeroChange: updateHero,
    onCloseColor: () => {
      if (isNarrowViewport) setMobilePanelOpen(false)
      else setActiveTool("sections")
    },
  }

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden overscroll-none"
      data-builder-workspace
    >
      {paymentRequired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Purchase Template to Publish</h2>
            <p className="text-sm text-gray-500 mb-5">
              You can edit this template for free, but publishing to the storefront requires purchasing a license first.
            </p>
            <div className="flex gap-3">
              {storeId && (
                <a
                  href={`/stores/${storeId}/templates`}
                  className="flex-1 py-2 px-4 bg-black text-white text-sm font-medium rounded-lg text-center hover:bg-gray-800 transition-colors"
                >
                  Purchase Template
                </a>
              )}
              <button
                type="button"
                onClick={() => setPaymentRequired(false)}
                className="flex-1 py-2 px-4 border border-gray-200 text-sm font-medium rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
      <EditorTopbar
        storeId={storeId}
        templateName={templateName}
        mode={mode}
        device={device}
        onModeChange={handleModeChange}
        onDeviceChange={handleDeviceChange}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onResetLayout={handleResetLayout}
        isSaving={isSaving}
      />

      {status && (
        <div className="shrink-0 border-b border-indigo-100 bg-indigo-50 px-4 py-2 text-center text-xs font-medium text-indigo-700">
          {status}
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {mode === "edit" && (
          <div className="hidden md:flex md:min-h-0 md:shrink-0">
            <BuilderToolRail
              activeTool={activeTool}
              onToolChange={setActiveTool}
              showSectionsTools={showSectionsTab}
              showMarketingTool={isMarketingPage}
            />

            <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <BuilderToolPanels {...toolPanelProps} />
              </div>
            </aside>
          </div>
        )}

        <div
          className={cn(
            "relative min-h-0 min-w-0 flex-1 overflow-hidden",
            mode === "edit" && isNarrowViewport && selectedElement && "pb-14",
          )}
        >
          <ThemeLivePreview
            templateId={templateId}
            config={config}
            device={device}
            storefrontHost={storefrontHost}
            selectedPage={selectedPage}
            onPageChange={handlePageChange}
            sectionEditor={sectionEditor}
            previewRootRef={previewRootRef}
          />
          {mode === "edit" && showSectionsTab && selectedElement && (
            <CanvasElementToolbar
              config={config}
              selectedPage={selectedPage as SectionPageType}
              device={device}
              element={selectedElement}
              croppingKey={croppingKey}
              storeId={storeId}
              onCroppingKeyChange={setCroppingKey}
              copiedTextStyle={copiedTextStyle}
              onCopiedTextStyleChange={setCopiedTextStyle}
              onPatchBlock={patchBlock}
              onPosition={() => {
                if (isNarrowViewport) openMobileTool("layers")
                else setActiveTool("layers")
              }}
              onColor={() => {
                if (isNarrowViewport) openMobileTool("color")
                else setActiveTool("color")
              }}
              onDeselect={() => setSelectedElement(null)}
              mobile={isNarrowViewport}
            />
          )}

          {mode === "edit" && (
            <BuilderMobileSheet
              open={mobilePanelOpen && isNarrowViewport}
              title={activeToolLabel}
              onClose={() => setMobilePanelOpen(false)}
              className={selectedElement ? "bottom-14" : undefined}
            >
              <BuilderToolPanels {...toolPanelProps} />
            </BuilderMobileSheet>
          )}
        </div>

        {mode === "edit" && (
          <div className="relative z-40 shrink-0 md:hidden" data-builder-chrome>
            <BuilderMobileNav
              activeTool={activeTool}
              onToolChange={handleMobileToolChange}
              showSectionsTools={showSectionsTab}
              showMarketingTool={isMarketingPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
