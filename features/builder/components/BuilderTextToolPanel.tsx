"use client"

import { Heading1, Heading2, Plus, Type, X } from "lucide-react"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import {
  addTextToArray,
  deleteTextFromArray,
} from "@/themes/engine/canvas-text"
import { resolveSectionCanvasTexts } from "@/themes/engine/cta-canvas"
import {
  isSameSelectedElement,
  type SelectedElement,
} from "@/themes/engine/section-editor"
import type {
  BlockInstance,
  SectionInstance,
  SectionPageType,
  ThemeConfig,
} from "@/themes/engine/schema"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"
import { cn } from "@/lib/utils"

interface BuilderTextToolPanelProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  selectedSectionId: string | null
  selectedElement?: SelectedElement | null
  device?: PreviewDevice
  onSelectBlock: (sectionId: string, blockId: string | null) => void
  onSelectElement?: (element: SelectedElement | null) => void
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onUpdateSectionSetting?: (
    sectionId: string,
    key: string,
    value: string | undefined,
  ) => void
}

/** Block yang menampung layer canvas (multi-image + teks bebas + tombol). */
export function findCanvasMediaBlock(
  instance: SectionInstance,
): BlockInstance | undefined {
  const blocks = instance.blocks ?? []
  if (instance.type === "hero") {
    return blocks.find((b) => b.type === "hero-media") ?? blocks[0]
  }
  if (instance.type === "call-to-action" || instance.type === "newsletter-cta") {
    return blocks[0]
  }
  return undefined
}

type TextRow = {
  element: SelectedElement
  label: string
  sublabel: string
  onDelete?: () => void
}

export function BuilderTextToolPanel({
  config,
  selectedPage,
  selectedSectionId,
  selectedElement,
  device = "desktop",
  onSelectBlock,
  onSelectElement,
  onPatchBlock,
}: BuilderTextToolPanelProps) {
  const instance = selectedSectionId
    ? resolvePageTemplate(config, selectedPage).sections[selectedSectionId]
    : undefined
  const sectionLabel = instance
    ? getSectionDefinition(config.templateId, instance.type)?.label ?? instance.type
    : null

  const mediaBlock = instance ? findCanvasMediaBlock(instance) : undefined
  const mediaSettings = mediaBlock
    ? (resolveDeviceSettings(
        mediaBlock.settings as Record<string, unknown> | undefined,
        device === "mobile",
      ) as Record<string, unknown> | undefined)
    : undefined
  const canvasTexts = resolveSectionCanvasTexts(
    config.templateId,
    instance?.type,
    instance?.settings as Record<string, unknown> | undefined,
    mediaSettings,
  )

  // Label kartu kategori — tiap card adalah host block dengan itemId "label".
  const categoryLabelBlocks =
    instance && !mediaBlock
      ? (instance.blocks ?? []).filter((b) => b.type === "category-card")
      : []

  const title1Hidden = mediaSettings?.title1Hidden === true
  const title2Hidden = mediaSettings?.title2Hidden === true
  const isHeroSection = instance?.type === "hero"

  const setTitleHidden = (line: "title1" | "title2", hidden: boolean) => {
    if (!selectedSectionId || !mediaBlock) return
    onPatchBlock(selectedSectionId, mediaBlock.id, { [`${line}Hidden`]: hidden })
    if (!hidden) {
      onSelectBlock(selectedSectionId, mediaBlock.id)
      onSelectElement?.({
        kind: "text",
        sectionId: selectedSectionId,
        blockId: mediaBlock.id,
        itemId: line,
      })
    }
  }

  const rows: TextRow[] = []
  if (selectedSectionId && mediaBlock && isHeroSection) {
    if (!title1Hidden) {
      rows.push({
        element: {
          kind: "text",
          sectionId: selectedSectionId,
          blockId: mediaBlock.id,
          itemId: "title1",
        },
        label: config.hero?.title || "Title 1",
        sublabel: "Hero title",
        onDelete: () => setTitleHidden("title1", true),
      })
    }
    if (!title2Hidden) {
      rows.push({
        element: {
          kind: "text",
          sectionId: selectedSectionId,
          blockId: mediaBlock.id,
          itemId: "title2",
        },
        label: config.hero?.subtitle || "Title 2",
        sublabel: "Hero subtitle",
        onDelete: () => setTitleHidden("title2", true),
      })
    }
  }
  if (selectedSectionId && mediaBlock) {
    for (const item of canvasTexts) {
      rows.push({
        element: {
          kind: "text",
          sectionId: selectedSectionId,
          blockId: mediaBlock.id,
          itemId: item.id,
        },
        label: item.value || "Empty text",
        sublabel: "Free text",
        onDelete: () =>
          onPatchBlock(selectedSectionId, mediaBlock.id, {
            texts: deleteTextFromArray(canvasTexts, item.id),
          }),
      })
    }
  }
  if (selectedSectionId) {
    for (const card of categoryLabelBlocks) {
      const cardSettings = resolveDeviceSettings(
        card.settings as Record<string, unknown> | undefined,
        device === "mobile",
      ) as Record<string, unknown> | undefined
      const label =
        typeof cardSettings?.label === "string" ? cardSettings.label : ""
      rows.push({
        element: {
          kind: "text",
          sectionId: selectedSectionId,
          blockId: card.id,
          itemId: "label",
        },
        label: label || "Empty label",
        sublabel: "Card label",
      })
    }
  }

  function addText() {
    if (!selectedSectionId || !mediaBlock) return
    const next = addTextToArray(canvasTexts)
    const newId = next[next.length - 1].id
    onPatchBlock(selectedSectionId, mediaBlock.id, { texts: next })
    onSelectBlock(selectedSectionId, mediaBlock.id)
    onSelectElement?.({
      kind: "text",
      sectionId: selectedSectionId,
      blockId: mediaBlock.id,
      itemId: newId,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Text</h2>
        <p className="mt-1 text-xs text-gray-400">
          {selectedSectionId && sectionLabel
            ? `Add text to the “${sectionLabel}” section.`
            : "Select a section in the preview to add text."}
        </p>
      </div>

      {!selectedSectionId ? (
        <EmptyState
          title="No section selected"
          hint="Click a section in the preview, then add text from here."
        />
      ) : !mediaBlock && rows.length === 0 ? (
        <EmptyState
          title="This section does not support free text"
          hint="Select a Hero or Call to Action section."
        />
      ) : (
        <>
          {mediaBlock && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={addText}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add text
            </button>
            {isHeroSection && title1Hidden && (
              <button
                type="button"
                onClick={() => setTitleHidden("title1", false)}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Heading1 className="h-4 w-4 text-gray-400" />
                Restore Title 1
              </button>
            )}
            {isHeroSection && title2Hidden && (
              <button
                type="button"
                onClick={() => setTitleHidden("title2", false)}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Heading2 className="h-4 w-4 text-gray-400" />
                Restore Subtitle
              </button>
            )}
          </div>
          )}

          {rows.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Text in this section
              </p>
              <ul className="space-y-1.5">
                {rows.map((row) => {
                  const isSelected = isSameSelectedElement(selectedElement, row.element)
                  return (
                    <li
                      key={`${row.element.blockId}-${row.element.itemId}`}
                      className="group relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectBlock(row.element.sectionId, row.element.blockId)
                          onSelectElement?.(row.element)
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl border px-3 py-2 pr-8 text-left transition-colors",
                          isSelected
                            ? "border-indigo-400 bg-indigo-50"
                            : "border-gray-200 bg-white hover:bg-gray-50",
                        )}
                      >
                        <Type className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-gray-800">
                            {row.label}
                          </span>
                          <span className="block text-[10px] font-medium uppercase tracking-wide text-gray-400">
                            {row.sublabel}
                          </span>
                        </span>
                      </button>
                      {row.onDelete && (
                        <button
                          type="button"
                          aria-label={`Remove ${row.label}`}
                          onClick={() => {
                            row.onDelete?.()
                            if (isSelected) onSelectElement?.(null)
                          }}
                          className="absolute right-2 top-1/2 z-10 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
              <p className="mt-2 text-[10px] text-gray-400">
                Click text to select — style it via the toolbar above the canvas.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
      <Type className="mx-auto h-6 w-6 text-gray-300" />
      <p className="mt-2 text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-[11px] text-gray-400">{hint}</p>
    </div>
  )
}
