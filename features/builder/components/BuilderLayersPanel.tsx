"use client"

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  ArrowUpToLine,
  Image as ImageIcon,
  Layers,
  MousePointerClick,
  Palette,
  Type,
} from "lucide-react"
import {
  SegmentedControl,
  SettingsField,
  SettingsInput,
} from "@/features/builder/components/SettingsSection"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import { getBlockDefinition } from "@/themes/engine/block-registry"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import {
  isSameSelectedElement,
  type SelectedElement,
} from "@/themes/engine/section-editor"
import {
  moveImageInArray,
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import { parseCanvasTexts } from "@/themes/engine/canvas-text"
import {
  resolveSectionCanvasButtons,
  resolveSectionCanvasTexts,
} from "@/themes/engine/cta-canvas"
import {
  HERO_DESIGN_HEIGHT,
  parseHeroCta,
} from "@/themes/bento/sections/hero-cta-layout"
import type { BlockInstance, SectionPageType, ThemeConfig } from "@/themes/engine/schema"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"
import { useMessages } from "@/features/i18n/LocaleProvider"
import type { Messages } from "@/features/i18n/messages"
import { cn } from "@/lib/utils"

type LayersMessages = Messages["pages"]["builder"]["layersPanel"]

interface BuilderLayersPanelProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  selectedSectionId: string | null
  selectedBlockId: string | null
  selectedElement?: SelectedElement | null
  device?: PreviewDevice
  onSelectBlock: (sectionId: string, blockId: string | null) => void
  onSelectElement?: (element: SelectedElement | null) => void
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onReorderBlocks: (sectionId: string, fromIndex: number, toIndex: number) => void
}

/** One selectable row in the layers list. */
type LayerRow = {
  element: SelectedElement
  label: string
  sublabel: string
  imageUrl?: string
  block: BlockInstance
  blockIndex: number
  /** Multi-image item — arrange/align patch the images array. */
  item?: CanvasImageItem
  items?: CanvasImageItem[]
  itemIndex?: number
  /** Legacy block-level image layer (Z = block order). */
  isLegacyImage?: boolean
  hasLabelLayer?: boolean
}

function numVal(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function isImageLayerBlock(
  config: ThemeConfig,
  sectionType: string,
  block: BlockInstance,
): boolean {
  const settings = block.settings ?? {}
  if (typeof settings.imageUrl === "string" || "xPct" in settings || "imgX" in settings) {
    return true
  }
  const def = getBlockDefinition(config.templateId, sectionType, block.type)
  if (!def) return false
  return (
    def.fields.some((f) => f.type === "image") ||
    block.type.includes("image") ||
    block.type.includes("media") ||
    block.type.includes("card")
  )
}

function collectLayerRows(
  config: ThemeConfig,
  selectedPage: SectionPageType,
  sectionId: string,
  isMobile: boolean,
  t: LayersMessages,
): { sectionLabel: string; rows: LayerRow[]; blockCount: number } | null {
  const resolved = resolvePageTemplate(config, selectedPage)
  const instance = resolved.sections[sectionId]
  if (!instance) return null

  const sectionLabel =
    getSectionDefinition(config.templateId, instance.type)?.label ?? instance.type
  const blocks = instance.blocks ?? []
  const rows: LayerRow[] = []

  blocks.forEach((block, blockIndex) => {
    const settings = resolveDeviceSettings(
      block.settings as Record<string, unknown> | undefined,
      isMobile,
    ) as Record<string, unknown> | undefined
    const def = getBlockDefinition(config.templateId, instance.type, block.type)
    const items = parseCanvasImages(settings)

    // Multi-image canvas items — one row per image, array order = Z order.
    items.forEach((item, itemIndex) => {
      rows.push({
        element: { kind: "image", sectionId, blockId: block.id, itemId: item.id },
        label: t.imageN.replace("{n}", String(itemIndex + 1)),
        sublabel: t.zN.replace("{n}", String(itemIndex + 1)),
        imageUrl: item.src,
        block,
        blockIndex,
        item,
        items,
        itemIndex,
      })
    })

    // Free canvas texts (added via the Text sidebar). Media block (index 0)
    // resolves seeded CTA items; other blocks parse plain.
    const texts =
      blockIndex === 0
        ? resolveSectionCanvasTexts(
            config.templateId,
            instance.type,
            instance.settings as Record<string, unknown> | undefined,
            settings,
          )
        : parseCanvasTexts(settings)
    for (const text of texts) {
      rows.push({
        element: { kind: "text", sectionId, blockId: block.id, itemId: text.id },
        label: text.value || t.emptyText,
        sublabel: t.freeText,
        block,
        blockIndex,
      })
    }

    // Canvas buttons (buttons[] — CTA section, dsb.).
    const buttons =
      blockIndex === 0
        ? resolveSectionCanvasButtons(
            config.templateId,
            instance.type,
            instance.settings as Record<string, unknown> | undefined,
            settings,
          )
        : []
    for (const button of buttons) {
      rows.push({
        element: { kind: "button", sectionId, blockId: block.id, itemId: button.id },
        label: button.label || t.button,
        sublabel: t.button,
        block,
        blockIndex,
      })
    }

    // Label kartu kategori — selectable text element per card.
    if (block.type === "category-card") {
      const label = typeof settings?.label === "string" ? settings.label : ""
      rows.push({
        element: { kind: "text", sectionId, blockId: block.id, itemId: "label" },
        label: label || t.emptyLabel,
        sublabel: t.cardLabel,
        block,
        blockIndex,
      })
    }

    // Card & latar hero — selectable frame element on the media block.
    if (block.type === "hero-media") {
      rows.push({
        element: { kind: "frame", sectionId, blockId: block.id },
        label: t.heroCardBg,
        sublabel: t.background,
        block,
        blockIndex,
      })
    }

    // Hero title lines live on the media block.
    if (block.type === "hero-media") {
      const lines: Array<{ id: "title1" | "title2"; value: string }> = [
        { id: "title1", value: config.hero?.title ?? t.fallbackTitle1 },
        { id: "title2", value: config.hero?.subtitle ?? t.fallbackTitle2 },
      ]
      for (const line of lines) {
        if (settings?.[`${line.id}Hidden`] === true) continue
        rows.push({
          element: { kind: "text", sectionId, blockId: block.id, itemId: line.id },
          label:
            line.value || (line.id === "title1" ? t.fallbackTitle1 : t.fallbackTitle2),
          sublabel:
            settings?.[`${line.id}Layer`] === "behind" ? t.textBehind : t.textInFront,
          block,
          blockIndex,
        })
      }
    }

    // CTA button block.
    if (block.type === "hero-cta") {
      const label = typeof settings?.label === "string" ? settings.label : undefined
      rows.push({
        element: { kind: "button", sectionId, blockId: block.id },
        label: label || config.hero?.ctaLabel || t.ctaButton,
        sublabel: t.button,
        block,
        blockIndex,
      })
    }

    // Legacy single-image blocks (no images array) — Z via block order.
    if (items.length === 0 && isImageLayerBlock(config, instance.type, block)) {
      const rawUrl = settings?.imageUrl
      rows.push({
        element: { kind: "image", sectionId, blockId: block.id },
        label: def?.label ?? t.imageN.replace("{n}", String(blockIndex + 1)),
        sublabel: t.layerZ.replace(/\{n\}/g, String(blockIndex + 1)),
        imageUrl: typeof rawUrl === "string" ? rawUrl : undefined,
        block,
        blockIndex,
        isLegacyImage: true,
        hasLabelLayer:
          "labelLayer" in (def?.defaultSettings ?? {}) ||
          "labelLayer" in (block.settings ?? {}),
      })
    }
  })

  return { sectionLabel, rows, blockCount: blocks.length }
}

export function BuilderLayersPanel({
  config,
  selectedPage,
  selectedSectionId,
  selectedBlockId,
  selectedElement,
  device = "desktop",
  onSelectBlock,
  onSelectElement,
  onPatchBlock,
  onReorderBlocks,
}: BuilderLayersPanelProps) {
  const t = useMessages().pages.builder.layersPanel
  const layerData = selectedSectionId
    ? collectLayerRows(config, selectedPage, selectedSectionId, device === "mobile", t)
    : null

  const selectRow = (row: LayerRow) => {
    if (!selectedSectionId) return
    onSelectBlock(selectedSectionId, row.block.id)
    onSelectElement?.(row.element)
  }

  const patchItem = (row: LayerRow, patch: Partial<CanvasImageItem>) => {
    if (!selectedSectionId || !row.item || !row.items) return
    onPatchBlock(selectedSectionId, row.block.id, {
      images: updateImageInArray(row.items, row.item.id, patch),
    })
  }

  const moveItem = (row: LayerRow, to: "forward" | "backward" | "front" | "back") => {
    if (!selectedSectionId || !row.item || !row.items) return
    onPatchBlock(selectedSectionId, row.block.id, {
      images: moveImageInArray(row.items, row.item.id, to),
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{t.title}</h2>
        <p className="mt-1 text-xs text-gray-400">
          {layerData
            ? t.elementsIn.replace("{section}", layerData.sectionLabel)
            : t.selectSection}
        </p>
      </div>

      {!selectedSectionId || !layerData ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <Layers className="mx-auto h-6 w-6 text-gray-300" />
          <p className="mt-2 text-xs font-medium text-gray-500">{t.noSection}</p>
          <p className="mt-1 text-[11px] text-gray-400">{t.noSectionHint}</p>
        </div>
      ) : layerData.rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
          <ImageIcon className="mx-auto h-6 w-6 text-gray-300" />
          <p className="mt-2 text-xs font-medium text-gray-500">{t.noLayers}</p>
          <p className="mt-1 text-[11px] text-gray-400">{t.noLayersHint}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {layerData.rows.map((row) => {
            const isSelected = selectedElement
              ? isSameSelectedElement(selectedElement, row.element)
              : selectedBlockId === row.block.id && !row.item
            const resolved = resolveDeviceSettings(
              row.block.settings,
              device === "mobile",
            )

            return (
              <li
                key={`${row.block.id}-${row.element.kind}-${row.element.itemId ?? "block"}`}
                className={cn(
                  "rounded-xl border bg-white transition-colors",
                  isSelected
                    ? "border-indigo-400 ring-1 ring-indigo-100"
                    : "border-gray-200",
                )}
              >
                <button
                  type="button"
                  onClick={() => selectRow(row)}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    {row.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : row.element.kind === "text" ? (
                      <Type className="h-3.5 w-3.5 text-gray-400" />
                    ) : row.element.kind === "button" ? (
                      <MousePointerClick className="h-3.5 w-3.5 text-gray-400" />
                    ) : row.element.kind === "frame" ? (
                      <Palette className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-800">
                      {row.label}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                      {row.sublabel}
                    </p>
                  </div>
                </button>

                {isSelected && row.item && row.items && (
                  <div className="space-y-3 border-t border-gray-100 px-3 py-3">
                    <div className="grid grid-cols-2 gap-2">
                      <SettingsField label={t.x}>
                        <SettingsInput
                          type="number"
                          value={row.item.x}
                          onChange={(e) =>
                            patchItem(row, { x: Number(e.target.value) })
                          }
                        />
                      </SettingsField>
                      <SettingsField label={t.y}>
                        <SettingsInput
                          type="number"
                          value={row.item.y}
                          onChange={(e) =>
                            patchItem(row, { y: Number(e.target.value) })
                          }
                        />
                      </SettingsField>
                    </div>

                    <SettingsField label={t.zOrder}>
                      <div className="grid grid-cols-4 gap-1.5">
                        <ArrangeButton
                          label={t.sendToBack}
                          disabled={row.itemIndex === 0}
                          onClick={() => moveItem(row, "back")}
                        >
                          <ArrowDownToLine className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.sendBackward}
                          disabled={row.itemIndex === 0}
                          onClick={() => moveItem(row, "backward")}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.bringForward}
                          disabled={row.itemIndex === row.items.length - 1}
                          onClick={() => moveItem(row, "forward")}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.bringToFront}
                          disabled={row.itemIndex === row.items.length - 1}
                          onClick={() => moveItem(row, "front")}
                        >
                          <ArrowUpToLine className="h-3.5 w-3.5" />
                        </ArrangeButton>
                      </div>
                    </SettingsField>

                    <SettingsField label={t.alignOnCanvas}>
                      <div className="grid grid-cols-6 gap-1.5">
                        <ArrangeButton
                          label={t.alignLeft}
                          onClick={() => patchItem(row, { x: 0 })}
                        >
                          <AlignStartVertical className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.alignCenterH}
                          onClick={() =>
                            patchItem(row, {
                              x: Math.round((100 - row.item!.width) / 2),
                            })
                          }
                        >
                          <AlignCenterVertical className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.alignRight}
                          onClick={() =>
                            patchItem(row, { x: Math.max(0, 100 - row.item!.width) })
                          }
                        >
                          <AlignEndVertical className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.alignTop}
                          onClick={() => patchItem(row, { y: 0 })}
                        >
                          <AlignStartHorizontal className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.alignCenterV}
                          onClick={() =>
                            patchItem(row, {
                              y: Math.round((100 - row.item!.height) / 2),
                            })
                          }
                        >
                          <AlignCenterHorizontal className="h-3.5 w-3.5" />
                        </ArrangeButton>
                        <ArrangeButton
                          label={t.alignBottom}
                          onClick={() =>
                            patchItem(row, { y: Math.max(0, 100 - row.item!.height) })
                          }
                        >
                          <AlignEndHorizontal className="h-3.5 w-3.5" />
                        </ArrangeButton>
                      </div>
                    </SettingsField>
                  </div>
                )}

                {isSelected && row.isLegacyImage && (
                  <div className="space-y-3 border-t border-gray-100 px-3 py-3">
                    <div className="grid grid-cols-2 gap-2">
                      <SettingsField
                        label={"xPct" in (row.block.settings ?? {}) ? t.offsetXPct : t.offsetX}
                      >
                        <SettingsInput
                          type="number"
                          value={numVal(
                            resolved?.["xPct" in (row.block.settings ?? {}) ? "xPct" : "imgX"],
                            0,
                          )}
                          onChange={(e) =>
                            onPatchBlock(selectedSectionId, row.block.id, {
                              ["xPct" in (row.block.settings ?? {}) ? "xPct" : "imgX"]:
                                Number(e.target.value),
                            })
                          }
                        />
                      </SettingsField>
                      <SettingsField
                        label={"xPct" in (row.block.settings ?? {}) ? t.offsetYPx : t.offsetY}
                      >
                        <SettingsInput
                          type="number"
                          value={numVal(
                            resolved?.["xPct" in (row.block.settings ?? {}) ? "yPx" : "imgY"],
                            0,
                          )}
                          onChange={(e) =>
                            onPatchBlock(selectedSectionId, row.block.id, {
                              ["xPct" in (row.block.settings ?? {}) ? "yPx" : "imgY"]:
                                Number(e.target.value),
                            })
                          }
                        />
                      </SettingsField>
                    </div>

                    <SettingsField label={t.zOrderFrontBack}>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={row.blockIndex === 0}
                          onClick={() =>
                            onReorderBlocks(
                              selectedSectionId,
                              row.blockIndex,
                              row.blockIndex - 1,
                            )
                          }
                          className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                          {t.back}
                        </button>
                        <button
                          type="button"
                          disabled={row.blockIndex >= layerData.blockCount - 1}
                          onClick={() =>
                            onReorderBlocks(
                              selectedSectionId,
                              row.blockIndex,
                              row.blockIndex + 1,
                            )
                          }
                          className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                          {t.front}
                        </button>
                      </div>
                    </SettingsField>

                    {row.hasLabelLayer && (
                      <SettingsField label={t.textVsImage}>
                        <SegmentedControl
                          value={resolved?.labelLayer === "behind" ? "behind" : "front"}
                          options={[
                            { value: "front", label: t.textInFront },
                            { value: "behind", label: t.textBehind },
                          ]}
                          onChange={(value) =>
                            onPatchBlock(selectedSectionId, row.block.id, {
                              labelLayer: value,
                            })
                          }
                        />
                      </SettingsField>
                    )}
                  </div>
                )}

                {isSelected && row.element.kind === "button" && !row.element.itemId && (() => {
                  const ctaLayout = parseHeroCta(
                    resolved as Record<string, unknown> | undefined,
                    "",
                    device === "mobile",
                  ).layout
                  const alignCta = (patch: Record<string, number>) =>
                    onPatchBlock(selectedSectionId, row.block.id, patch)
                  return (
                    <div className="border-t border-gray-100 px-3 py-3">
                      <SettingsField label={t.alignOnCanvas}>
                        <div className="grid grid-cols-6 gap-1.5">
                          <ArrangeButton
                            label={t.alignLeft}
                            onClick={() => alignCta({ xPct: 0 })}
                          >
                            <AlignStartVertical className="h-3.5 w-3.5" />
                          </ArrangeButton>
                          <ArrangeButton
                            label={t.alignCenterH}
                            onClick={() =>
                              alignCta({
                                xPct: Math.round((100 - ctaLayout.wPct) / 2),
                              })
                            }
                          >
                            <AlignCenterVertical className="h-3.5 w-3.5" />
                          </ArrangeButton>
                          <ArrangeButton
                            label={t.alignRight}
                            onClick={() =>
                              alignCta({ xPct: Math.max(0, 100 - ctaLayout.wPct) })
                            }
                          >
                            <AlignEndVertical className="h-3.5 w-3.5" />
                          </ArrangeButton>
                          <ArrangeButton
                            label={t.alignTop}
                            onClick={() => alignCta({ yPx: 0 })}
                          >
                            <AlignStartHorizontal className="h-3.5 w-3.5" />
                          </ArrangeButton>
                          <ArrangeButton
                            label={t.alignCenterV}
                            onClick={() =>
                              alignCta({
                                yPx: Math.round(
                                  (HERO_DESIGN_HEIGHT - ctaLayout.hPx) / 2,
                                ),
                              })
                            }
                          >
                            <AlignCenterHorizontal className="h-3.5 w-3.5" />
                          </ArrangeButton>
                          <ArrangeButton
                            label={t.alignBottom}
                            onClick={() =>
                              alignCta({
                                yPx: Math.max(0, HERO_DESIGN_HEIGHT - ctaLayout.hPx),
                              })
                            }
                          >
                            <AlignEndHorizontal className="h-3.5 w-3.5" />
                          </ArrangeButton>
                        </div>
                      </SettingsField>
                    </div>
                  )
                })()}

                {isSelected && row.element.kind === "text" && (
                  <div className="border-t border-gray-100 px-3 py-3">
                    <SettingsField label={t.textLayer}>
                      <SegmentedControl
                        value={
                          resolved?.[`${row.element.itemId}Layer`] === "behind"
                            ? "behind"
                            : "front"
                        }
                        options={[
                          { value: "front", label: t.inFrontOfImage },
                          { value: "behind", label: t.behindImage },
                        ]}
                        onChange={(value) =>
                          onPatchBlock(selectedSectionId, row.block.id, {
                            [`${row.element.itemId}Layer`]: value,
                          })
                        }
                      />
                    </SettingsField>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ArrangeButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}
