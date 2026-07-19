"use client"

import { ImagePlus, X } from "lucide-react"
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
      slots.push({
        id: `${sectionId}:${block.id}:${field.key}`,
        label: field.label || blockDef.label,
        value: typeof raw === "string" ? raw : undefined,
        blockId: block.id,
        settingKey: field.key,
        scope: "block",
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

  const legacySlots =
    selectedSectionId && !mediaBlock
      ? collectLegacySlots(config, selectedPage, selectedSectionId)
      : []

  function addImage(url: string | undefined) {
    if (!url || !selectedSectionId || !mediaBlock) return
    const next = addImageToArray(canvasImages, url)
    const newId = next[next.length - 1].id
    onPatchBlock(selectedSectionId, mediaBlock.id, { images: next })
    onSelectBlock(selectedSectionId, mediaBlock.id)
    onSelectElement?.({
      kind: "image",
      sectionId: selectedSectionId,
      blockId: mediaBlock.id,
      itemId: newId,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Image</h2>
        <p className="mt-1 text-xs text-gray-400">
          {selectedSectionId && sectionLabel
            ? `Tambah gambar ke section “${sectionLabel}”.`
            : "Pilih section di preview untuk tambah gambar."}
        </p>
      </div>

      {!selectedSectionId ? (
        <EmptyState
          title="Belum ada section dipilih"
          hint="Klik section di preview, lalu tambahkan gambar dari sini."
        />
      ) : mediaBlock ? (
        <>
          <ImageUploadField
            value={undefined}
            placeholder="Upload gambar baru"
            onChange={addImage}
          />

          {canvasImages.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Gambar di section ini
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
                        aria-label={`Pilih gambar ${index + 1}`}
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
                        aria-label={`Hapus gambar ${index + 1}`}
                        onClick={() => {
                          onPatchBlock(selectedSectionId, mediaBlock.id, {
                            images: deleteImageFromArray(canvasImages, img.id),
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
                Klik gambar untuk pilih — atur lewat toolbar & Layers.
              </p>
            </div>
          )}
        </>
      ) : legacySlots.length === 0 ? (
        <EmptyState
          title="Section ini tidak punya slot gambar"
          hint="Pilih section lain yang punya media."
        />
      ) : (
        <ul className="space-y-3">
          {legacySlots.map((slot) => (
            <li key={slot.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <button
                type="button"
                onClick={() => {
                  if (slot.blockId) onSelectBlock(selectedSectionId, slot.blockId)
                }}
                className="mb-2 w-full text-left text-xs font-semibold text-gray-800"
              >
                {slot.label}
              </button>
              <ImageUploadField
                value={slot.value}
                placeholder={`Upload ${slot.label}`}
                onChange={(url) => {
                  if (slot.scope === "section") {
                    onUpdateSectionSetting(selectedSectionId, slot.settingKey, url)
                  } else if (slot.blockId) {
                    onUpdateBlockSetting(
                      selectedSectionId,
                      slot.blockId,
                      slot.settingKey,
                      url,
                    )
                  }
                }}
              />
            </li>
          ))}
        </ul>
      )}
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
