"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, Upload, X } from "lucide-react"
import { ImageUploadField } from "@/features/builder/components/ImageUploadField"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import { getBlockDefinition } from "@/themes/engine/block-registry"
import { getSectionSettingFields } from "@/themes/engine/section-settings-schema"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import {
  addImageToArray,
  deleteImageFromArray,
  parseCanvasImages,
} from "@/themes/engine/canvas-image"
import {
  isSameSelectedElement,
  type SelectedElement,
} from "@/themes/engine/section-editor"
import { findCanvasMediaBlock } from "@/features/builder/components/BuilderTextToolPanel"
import { useMessages } from "@/features/i18n/LocaleProvider"
import type { SectionPageType, ThemeConfig } from "@/themes/engine/schema"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"
import { cn } from "@/lib/utils"

type LegacySlot = {
  id: string
  label: string
  value: string | undefined
  blockId?: string
  settingKey: string
  scope: "section" | "block"
  /** Canvas free-box images (model hero) di block ini — bila ada, dipakai menggantikan value legacy. */
  canvasImages?: ReturnType<typeof parseCanvasImages>
}

interface BuilderImageToolPanelProps {
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
  onUpdateBlockSetting: (
    sectionId: string,
    blockId: string,
    key: string,
    value: string | number | undefined,
  ) => void
  onUpdateSectionSetting: (
    sectionId: string,
    key: string,
    value: string | undefined,
  ) => void
}

/** Slot gambar legacy (section tanpa layer canvas — mis. kartu kategori). */
function collectLegacySlots(
  config: ThemeConfig,
  selectedPage: SectionPageType,
  sectionId: string,
): LegacySlot[] {
  const instance = resolvePageTemplate(config, selectedPage).sections[sectionId]
  if (!instance) return []

  const slots: LegacySlot[] = []

  for (const field of getSectionSettingFields(config.templateId, instance.type)) {
    if (field.type !== "image") continue
    const raw = instance.settings?.[field.key]
    slots.push({
      id: `${sectionId}:${field.key}`,
      label: field.label,
      value: typeof raw === "string" ? raw : undefined,
      settingKey: field.key,
      scope: "section",
    })
  }

  for (const block of instance.blocks ?? []) {
    const blockDef = getBlockDefinition(config.templateId, instance.type, block.type)
    if (!blockDef) continue
    for (const field of blockDef.fields) {
      if (field.type !== "image") continue
      const raw = block.settings?.[field.key]
      const cardLabel = block.settings?.label
      const canvasImages = parseCanvasImages(
        block.settings as Record<string, unknown> | undefined,
      )
      slots.push({
        id: `${sectionId}:${block.id}:${field.key}`,
        label:
          typeof cardLabel === "string" && cardLabel
            ? cardLabel
            : field.label || blockDef.label,
        value:
          canvasImages[0]?.src ?? (typeof raw === "string" && raw ? raw : undefined),
        blockId: block.id,
        settingKey: field.key,
        scope: "block",
        canvasImages,
      })
    }
  }

  return slots
}

export function BuilderImageToolPanel({
  config,
  selectedPage,
  selectedSectionId,
  selectedElement,
  device = "desktop",
  onSelectBlock,
  onSelectElement,
  onPatchBlock,
  onUpdateBlockSetting,
  onUpdateSectionSetting,
}: BuilderImageToolPanelProps) {
  const tp = useMessages().pages.builder.imagePanel
  const tb = useMessages().pages.builder.toolbar
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
  const canvasImages = parseCanvasImages(mediaSettings)
  const legacyImageUrl =
    typeof mediaSettings?.imageUrl === "string" && mediaSettings.imageUrl.trim()
      ? mediaSettings.imageUrl.trim()
      : undefined

  const legacySlots =
    selectedSectionId && !mediaBlock
      ? collectLegacySlots(config, selectedPage, selectedSectionId)
      : []

  function addImage(url: string | undefined) {
    if (!url || !selectedSectionId || !mediaBlock) return
    const next = addImageToArray(canvasImages, url)
    const newId = next[next.length - 1].id
    // Drop legacy full-bleed imageUrl so it cannot reappear after canvas edits.
    onPatchBlock(selectedSectionId, mediaBlock.id, { images: next, imageUrl: "" })
    onSelectBlock(selectedSectionId, mediaBlock.id)
    onSelectElement?.({
      kind: "image",
      sectionId: selectedSectionId,
      blockId: mediaBlock.id,
      itemId: newId,
    })
  }

  function clearLegacyImage() {
    if (!selectedSectionId || !mediaBlock) return
    onPatchBlock(selectedSectionId, mediaBlock.id, { imageUrl: "", images: [] })
    onSelectElement?.(null)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{tp.title}</h2>
        <p className="mt-1 text-xs text-gray-400">
          {selectedSectionId && sectionLabel
            ? tp.addTo.replace("{section}", sectionLabel)
            : tp.selectSection}
        </p>
      </div>

      {!selectedSectionId ? (
        <EmptyState title={tp.noSection} hint={tp.noSectionHint} />
      ) : mediaBlock ? (
        <>
          <ImageUploadField
            value={undefined}
            placeholder={tp.uploadNew}
            onChange={addImage}
          />

          {/* Legacy single imageUrl (pre-canvas) — must be clearable or it ghosts after delete */}
          {canvasImages.length === 0 && legacyImageUrl && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {tp.legacyLabel}
              </p>
              <div className="group relative">
                <div className="aspect-square w-full overflow-hidden rounded-xl border border-amber-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={legacyImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  aria-label={tp.removeLegacy}
                  onClick={clearLegacyImage}
                  className="absolute -right-1.5 -top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => addImage(legacyImageUrl)}
                className="mt-2 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                {tb.convertToCanvas}
              </button>
              <p className="mt-1.5 text-[10px] text-amber-700/80">
                {tp.orRemove}
              </p>
            </div>
          )}

          {canvasImages.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {tp.imagesInSection}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {canvasImages.map((img, index) => {
                  const element: SelectedElement = {
                    kind: "image",
                    sectionId: selectedSectionId,
                    blockId: mediaBlock.id,
                    itemId: img.id,
                  }
                  const isSelected = isSameSelectedElement(selectedElement, element)
                  return (
                    <div key={img.id} className="group relative">
                      <button
                        type="button"
                        aria-label={`Select image ${index + 1}`}
                        onClick={() => {
                          onSelectBlock(selectedSectionId, mediaBlock.id)
                          onSelectElement?.(element)
                        }}
                        className={cn(
                          "aspect-square w-full overflow-hidden rounded-xl border bg-gray-100 transition-all",
                          isSelected
                            ? "border-indigo-400 ring-2 ring-indigo-200"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove image ${index + 1}`}
                        onClick={() => {
                          const next = deleteImageFromArray(canvasImages, img.id)
                          onPatchBlock(selectedSectionId, mediaBlock.id, {
                            images: next,
                            // Prevent legacy full-bleed fallback after last canvas image is removed.
                            ...(next.length === 0 ? { imageUrl: "" } : {}),
                          })
                          if (isSelected) onSelectElement?.(null)
                        }}
                        className="absolute -right-1.5 -top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
              <p className="mt-2 text-[10px] text-gray-400">
                {tp.clickToSelect}
              </p>
            </div>
          )}
        </>
      ) : legacySlots.length === 0 ? (
        <EmptyState title={tp.noSlots} hint={tp.noSlotsHint} />
      ) : (
        <>
          {legacySlots.some((slot) => slot.scope === "block") && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {tp.imagesInSection}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {legacySlots
                  .filter((slot) => slot.scope === "block")
                  .map((slot) => {
                    // Canvas image (model hero) → element ber-itemId (toolbar penuh:
                    // crop/replace/remove-bg). Legacy imageUrl → element tanpa itemId.
                    const canvasImg = slot.canvasImages?.[0]
                    const element: SelectedElement | null = slot.blockId
                      ? {
                          kind: "image",
                          sectionId: selectedSectionId,
                          blockId: slot.blockId,
                          ...(canvasImg ? { itemId: canvasImg.id } : {}),
                        }
                      : null
                    const isSelected =
                      element != null && isSameSelectedElement(selectedElement, element)
                    return (
                      <BlockImageSlotTile
                        key={slot.id}
                        slot={slot}
                        selected={isSelected}
                        onSelect={() => {
                          if (!slot.blockId || !element) return
                          onSelectBlock(selectedSectionId, slot.blockId)
                          onSelectElement?.(element)
                        }}
                        onUpload={(url) => {
                          if (!slot.blockId) return
                          // Upload = canvas free-box baru (model hero), legacy dibuang.
                          const next = addImageToArray([], url)
                          onPatchBlock(selectedSectionId, slot.blockId, {
                            images: next,
                            [slot.settingKey]: "",
                          })
                          onSelectBlock(selectedSectionId, slot.blockId)
                          onSelectElement?.({
                            kind: "image",
                            sectionId: selectedSectionId,
                            blockId: slot.blockId,
                            itemId: next[next.length - 1].id,
                          })
                        }}
                        onClear={() => {
                          if (!slot.blockId) return
                          onPatchBlock(selectedSectionId, slot.blockId, {
                            images: [],
                            [slot.settingKey]: "",
                          })
                          if (isSelected) onSelectElement?.(null)
                        }}
                      />
                    )
                  })}
              </div>
              <p className="mt-2 text-[10px] text-gray-400">
                {tp.clickToSelect}
              </p>
            </div>
          )}

          {legacySlots.some((slot) => slot.scope === "section") && (
            <ul className="space-y-3">
              {legacySlots
                .filter((slot) => slot.scope === "section")
                .map((slot) => (
                  <li key={slot.id} className="rounded-xl border border-gray-200 bg-white p-3">
                    <p className="mb-2 text-xs font-semibold text-gray-800">{slot.label}</p>
                    <ImageUploadField
                      value={slot.value}
                      placeholder={`Upload ${slot.label}`}
                      onChange={(url) =>
                        onUpdateSectionSetting(selectedSectionId, slot.settingKey, url)
                      }
                    />
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Tile slot gambar per block (kartu kategori dsb) — UX sama grid thumbnail
 * hero: klik pilih elemen di canvas (floating toolbar muncul), X hapus,
 * tile kosong = tombol upload langsung.
 */
function BlockImageSlotTile({
  slot,
  selected,
  onSelect,
  onUpload,
  onClear,
}: {
  slot: LegacySlot
  selected: boolean
  onSelect: () => void
  onUpload: (url: string) => void
  onClear: () => void
}) {
  const tp = useMessages().pages.builder.imagePanel
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed")
      onUpload(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="group relative">
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

      {slot.value ? (
        <>
          <button
            type="button"
            aria-label={`Select ${slot.label}`}
            onClick={onSelect}
            className={cn(
              "aspect-square w-full overflow-hidden rounded-xl border bg-gray-100 transition-all",
              selected
                ? "border-indigo-400 ring-2 ring-indigo-200"
                : "border-gray-200 hover:border-gray-300",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slot.value} alt="" className="h-full w-full object-cover" />
          </button>
          <button
            type="button"
            aria-label={`Remove ${slot.label}`}
            onClick={onClear}
            className="absolute -right-1.5 -top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={uploading}
          aria-label={`Upload ${slot.label}`}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-100 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="text-[9px] font-medium">{tp.upload}</span>
        </button>
      )}

      <p className="mt-1 truncate text-center text-[9px] text-gray-400">{slot.label}</p>
      {error && <p className="text-[9px] text-red-600">{error}</p>}
    </div>
  )
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
      <ImagePlus className="mx-auto h-6 w-6 text-gray-300" />
      <p className="mt-2 text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-[11px] text-gray-400">{hint}</p>
    </div>
  )
}
