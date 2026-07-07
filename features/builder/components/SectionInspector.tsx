"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react"
import { BlockSettingsFields } from "@/features/builder/components/BlockSettingsFields"
import { HeroCtaColorFields } from "@/features/builder/components/HeroCtaColorFields"
import { SettingsGroupsForm } from "@/features/builder/components/SettingsGroupsForm"
import {
  SegmentedControl,
  SettingsField,
  SettingsInput,
} from "@/features/builder/components/SettingsSection"
import { SectionSettingsFields } from "@/features/builder/components/SectionSettingsFields"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { getSectionDefinition } from "@/themes/engine/section-registry"
import {
  sectionHasSettings,
} from "@/themes/engine/section-settings-schema"
import {
  getBlockDefinitions,
  getBlockDefinition,
  sectionHasBlocks,
} from "@/themes/engine/block-registry"
import { HERO_SECTION_SETTINGS_GROUPS } from "@/themes/engine/settings-schema"
import {
  MAX_CATEGORY_CARDS,
} from "@/themes/bento/sections/category-grid-layout"
import {
  MAX_IMAGE_LAYERS,
} from "@/themes/engine/image-layer-layout"
import { applyDevicePatch, resolveDeviceSettings } from "@/themes/engine/device-settings"
import { MAX_CTA_RADIUS, parseCtaRadius } from "@/themes/bento/sections/hero-cta-layout"
import { parseHeroTitleLayout } from "@/themes/bento/sections/hero-title-layout"
import {
  addImageToArray,
  deleteImageFromArray,
  parseCanvasImages,
  updateImageInArray,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"
import type { BlockInstance, HeroConfig, SectionPageType, ThemeConfig } from "@/themes/engine/schema"

// ---------------------------------------------------------------------------
// HeroImageListPanel — multi-image management panel inside sidebar
// ---------------------------------------------------------------------------

interface HeroImageListPanelProps {
  images: CanvasImageItem[]
  onChange: (images: CanvasImageItem[]) => void
}

function HeroImageListPanel({ images, onChange }: HeroImageListPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function openFilePicker(onUrl: (url: string) => void) {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/png,image/jpeg,image/webp,image/svg+xml"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const form = new FormData()
      form.append("file", file)
      try {
        const res = await fetch("/api/upload", { method: "POST", body: form })
        const data = await res.json()
        if (res.ok && typeof data.url === "string") onUrl(data.url)
      } catch {
        // silent — no error UI for now
      }
    }
    input.click()
  }

  function handleAdd() {
    openFilePicker((url) => onChange(addImageToArray(images, url)))
  }

  function handleUpdate(id: string) {
    openFilePicker((url) => onChange(updateImageInArray(images, id, { src: url })))
  }

  function handleDelete(id: string) {
    onChange(deleteImageFromArray(images, id))
    if (expandedId === id) setExpandedId(null)
  }

  function handlePatch(id: string, patch: Partial<CanvasImageItem>) {
    onChange(updateImageInArray(images, id, patch))
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        Gambar ({images.length})
      </p>

      {images.length === 0 && (
        <p className="text-[11px] text-gray-400">
          Belum ada gambar. Klik tombol di bawah untuk menambah.
        </p>
      )}

      <ul className="space-y-1.5">
        {images.map((img, idx) => {
          const isExpanded = expandedId === img.id
          return (
            <li key={img.id} className="rounded-md border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="h-9 w-12 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt="" className="h-full w-full object-cover" />
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : img.id)}
                  className="flex-1 truncate text-left"
                >
                  <span className="block text-[11px] font-medium text-gray-700">
                    Gambar {idx + 1}
                  </span>
                  <span className="block text-[10px] text-gray-400">
                    {Math.round(img.width)}%×{Math.round(img.height)}% · {img.rotation}°
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate(img.id)}
                  className="rounded p-1 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                  title="Ganti gambar"
                >
                  <Pencil className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  title="Hapus gambar"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {isExpanded && (
                <div className="space-y-3 border-t border-gray-100 px-2 pb-3 pt-2">
                  <SettingsField label={`Lebar (${Math.round(img.width)}% kanvas)`}>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={0.5}
                      value={img.width}
                      onChange={(e) => handlePatch(img.id, { width: Number(e.target.value) })}
                      className="h-1.5 w-full cursor-pointer accent-indigo-600"
                    />
                  </SettingsField>

                  <SettingsField label={`Tinggi (${Math.round(img.height)}% kanvas)`}>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={0.5}
                      value={img.height}
                      onChange={(e) => handlePatch(img.id, { height: Number(e.target.value) })}
                      className="h-1.5 w-full cursor-pointer accent-indigo-600"
                    />
                  </SettingsField>

                  <SettingsField label={`Rotasi (${img.rotation}°)`}>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={img.rotation}
                      onChange={(e) => handlePatch(img.id, { rotation: Number(e.target.value) })}
                      className="h-1.5 w-full cursor-pointer accent-indigo-600"
                    />
                  </SettingsField>

                  <SettingsField label={`Skala zoom (${Math.round(img.scale * 100)}%)`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0.1}
                        max={5}
                        step={0.05}
                        value={img.scale}
                        onChange={(e) => handlePatch(img.id, { scale: Number(e.target.value) })}
                        className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={() => handlePatch(img.id, { scale: 1 })}
                        className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        Reset
                      </button>
                    </div>
                  </SettingsField>

                  <p className="text-[10px] text-gray-400">
                    Drag gambar di canvas untuk geser · ⊙ zoom · □ resize bingkai
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-2.5 text-[11px] font-semibold text-indigo-600 transition-colors hover:border-indigo-400 hover:bg-indigo-100"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        Tambah Gambar Baru
      </button>
    </div>
  )
}

const HERO_TITLE_LAYER_OPTIONS = [
  { value: "front", label: "Di depan" },
  { value: "behind", label: "Di belakang" },
] as const

const LABEL_LAYER_OPTIONS = HERO_TITLE_LAYER_OPTIONS

const ALL_HERO_FONT_OPTIONS = [
  "Inter",
  "Geist",
  "Playfair Display",
  "Lora",
  "DM Serif Display",
  "Plus Jakarta Sans",
  "DM Sans",
] as const

const FONT_WEIGHT_OPTIONS = [
  { value: "", label: "Auto" },
  { value: "300", label: "Tipis" },
  { value: "700", label: "Tebal" },
  { value: "900", label: "Hitam" },
] as const

const FONT_STYLE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Miring" },
] as const

interface TitleStyleFieldsProps {
  line: "title1" | "title2"
  lineLabel: string
  settings: Record<string, unknown> | undefined
  onChange: (patch: Record<string, unknown>) => void
}

function TitleStyleFields({ line, lineLabel, settings, onChange }: TitleStyleFieldsProps) {
  const colorKey = `${line}Color`
  const fontFamilyKey = `${line}FontFamily`
  const fontWeightKey = `${line}FontWeight`
  const fontStyleKey = `${line}FontStyle`

  const currentColor =
    typeof settings?.[colorKey] === "string" ? (settings[colorKey] as string) : ""
  const currentFont =
    typeof settings?.[fontFamilyKey] === "string" ? (settings[fontFamilyKey] as string) : ""
  const currentWeight =
    settings?.[fontWeightKey] != null ? String(settings[fontWeightKey]) : ""
  const currentStyle =
    settings?.[fontStyleKey] === "italic"
      ? "italic"
      : settings?.[fontStyleKey] === "normal"
        ? "normal"
        : "normal"

  return (
    <>
      <SettingsField label={`Warna ${lineLabel}`}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentColor || "#ffffff"}
            onChange={(e) => onChange({ [colorKey]: e.target.value })}
            className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-200 bg-white p-0.5"
          />
          <SettingsInput
            value={currentColor}
            placeholder="Default tema"
            onChange={(e) => onChange({ [colorKey]: e.target.value })}
          />
          {currentColor && (
            <button
              type="button"
              onClick={() => onChange({ [colorKey]: "" })}
              className="shrink-0 text-[13px] font-medium text-gray-400 hover:text-gray-600"
              title="Reset ke warna default tema"
            >
              ↺
            </button>
          )}
        </div>
      </SettingsField>
      <SettingsField label={`Font ${lineLabel}`}>
        <select
          value={currentFont}
          onChange={(e) => onChange({ [fontFamilyKey]: e.target.value })}
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="">Default (tema)</option>
          {ALL_HERO_FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </SettingsField>
      <SettingsField label={`Ketebalan ${lineLabel}`}>
        <SegmentedControl
          value={currentWeight}
          options={[...FONT_WEIGHT_OPTIONS]}
          onChange={(v) =>
            onChange({ [fontWeightKey]: v === "" ? "" : Number(v) })
          }
        />
      </SettingsField>
      <SettingsField label={`Gaya ${lineLabel}`}>
        <SegmentedControl
          value={currentStyle}
          options={[...FONT_STYLE_OPTIONS]}
          onChange={(v) => onChange({ [fontStyleKey]: v })}
        />
      </SettingsField>
    </>
  )
}

interface SectionInspectorProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  selectedSectionId: string | null
  selectedBlockId?: string | null
  device?: PreviewDevice
  onConfigChange: (config: ThemeConfig) => void
  onHeroChange: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void
  onSectionSettingsChange: (sectionId: string, settings: Record<string, unknown>) => void
  onSectionBlocksChange: (sectionId: string, blocks: BlockInstance[]) => void
}

function getBlockDisplayName(block: BlockInstance): string {
  const s = block.settings as Record<string, unknown> | undefined
  const name = s?.name ?? s?.title ?? s?.label
  return typeof name === "string" && name ? name : block.type
}

export function SectionInspector({
  config,
  selectedPage,
  selectedSectionId,
  selectedBlockId,
  device = "desktop",
  onConfigChange,
  onHeroChange,
  onSectionSettingsChange,
  onSectionBlocksChange,
}: SectionInspectorProps) {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedBlockId) {
      setExpandedBlockId(selectedBlockId)
    }
  }, [selectedBlockId])

  if (!selectedSectionId) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-6 text-center">
        <p className="text-xs text-gray-500">
          Pilih section di daftar atau klik langsung di preview untuk mengedit konten.
        </p>
      </div>
    )
  }

  const sectionId = selectedSectionId
  const template = resolvePageTemplate(config, selectedPage)
  const instance = template.sections[sectionId]
  if (!instance) {
    return null
  }

  const definition = getSectionDefinition(config.templateId, instance.type)
  const label = definition?.label ?? instance.type
  const hasBlocks = sectionHasBlocks(config.templateId, instance.type)
  const blockDefs = getBlockDefinitions(config.templateId, instance.type)
  const firstBlockType = Object.keys(blockDefs)[0]
  const firstBlockDef = firstBlockType ? blockDefs[firstBlockType] : undefined
  const currentBlocks: BlockInstance[] = instance.blocks ?? []

  const maxBlocks =
    instance.type === "category-grid" &&
    (config.templateId === "bento" || config.templateId === "minimalist")
      ? MAX_CATEGORY_CARDS
      : instance.type === "image-layers" && config.templateId === "minimalist"
        ? MAX_IMAGE_LAYERS
        : undefined
  const atBlockLimit = maxBlocks != null && currentBlocks.length >= maxBlocks

  function addBlock() {
    if (!firstBlockType || !firstBlockDef || atBlockLimit) return
    const newBlock: BlockInstance = {
      id: `${firstBlockType}-${Date.now()}`,
      type: firstBlockType,
      settings: { ...firstBlockDef.defaultSettings },
    }
    onSectionBlocksChange(sectionId, [...currentBlocks, newBlock])
  }

  function removeBlock(index: number) {
    onSectionBlocksChange(
      sectionId,
      currentBlocks.filter((_, i) => i !== index),
    )
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= currentBlocks.length) return
    const next = [...currentBlocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onSectionBlocksChange(sectionId, next)
  }

  function updateBlockSettings(index: number, settings: Record<string, unknown>) {
    const next = currentBlocks.map((block, i) =>
      i === index
        ? {
            ...block,
            settings: applyDevicePatch(block.settings ?? {}, settings, device),
          }
        : block,
    )
    onSectionBlocksChange(sectionId, next)
  }

  if (instance.type === "hero" && config.templateId === "minimalist") {
    const heroMediaDef = blockDefs["hero-media"]
    const heroCtaDef = blockDefs["hero-cta"]
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const selectedDef =
      selectedBlock?.type === "hero-cta"
        ? heroCtaDef
        : selectedBlock?.type === "hero-media"
          ? heroMediaDef
          : null
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined
    const title1LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title1",
      device === "mobile",
    ).hPct
    const title2LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title2",
      device === "mobile",
    ).hPct

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik gambar hero atau tombol CTA di canvas untuk mengedit. Ukuran & posisi CTA
              diatur lewat handle resize di canvas.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul baris 1">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="Quiet Luxury"
                  onChange={(e) => onHeroChange("title", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Judul baris 2">
                <SettingsInput
                  value={config.hero?.subtitle ?? ""}
                  placeholder="Curated essentials designed with intention"
                  onChange={(e) => onHeroChange("subtitle", e.target.value)}
                />
              </SettingsField>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {selectedDef?.label ?? selectedBlock.type}
              </span>
            </div>
            {selectedDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                {selectedBlock.type === "hero-media" && (
                  <>
                    <HeroImageListPanel
                      images={parseCanvasImages(resolvedSettings)}
                      onChange={(imgs) => updateBlockSettings(selectedIdx, { images: imgs })}
                    />
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Judul
                      </p>
                      <SettingsField label="Judul baris 1">
                        <SettingsInput
                          value={config.hero?.title ?? ""}
                          placeholder="Quiet Luxury"
                          onChange={(e) => onHeroChange("title", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Judul baris 2">
                        <SettingsInput
                          value={config.hero?.subtitle ?? ""}
                          placeholder="Curated essentials designed with intention"
                          onChange={(e) => onHeroChange("subtitle", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 1" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={resolvedSettings?.title1Layer === "behind" ? "behind" : "front"}
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title1Layer: value })
                          }
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 2" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={resolvedSettings?.title2Layer === "behind" ? "behind" : "front"}
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title2Layer: value })
                          }
                        />
                      </SettingsField>
                    </div>
                    <SettingsField
                      label={`Ukuran font baris 1 (${Math.round(title1LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title1LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title1LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <SettingsField
                      label={`Ukuran font baris 2 (${Math.round(title2LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title2LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title2LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Styling Teks
                      </p>
                      <TitleStyleFields
                        line="title1"
                        lineLabel="baris 1"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                      <TitleStyleFields
                        line="title2"
                        lineLabel="baris 2"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                    </p>
                  </>
                )}
                {selectedBlock.type === "hero-cta" && heroCtaDef && (
                  <>
                    <SettingsField label="Teks Tombol">
                      <SettingsInput
                        value={
                          (typeof resolvedSettings?.label === "string"
                            ? resolvedSettings.label
                            : config.hero?.ctaLabel) ?? ""
                        }
                        placeholder="Shop Collection"
                        onChange={(e) =>
                          updateBlockSettings(selectedIdx, { label: e.target.value })
                        }
                      />
                    </SettingsField>
                    <HeroCtaColorFields
                      settings={resolvedSettings}
                      primaryColor={config.primaryColor}
                      onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                    />
                    <p className="text-[11px] text-gray-500">
                      Warna kosong = ikuti Theme Settings. Isi manual untuk override per
                      tombol. Posisi & ukuran: tarik tepi/sudut di canvas.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (instance.type === "call-to-action" && config.templateId === "minimalist") {
    const ctaImageDef = blockDefs["cta-image"]
    const ctaTitleDef = blockDefs["cta-title"]
    const heroCtaDef = blockDefs["hero-cta"]
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const selectedDef =
      selectedBlock?.type === "cta-image"
        ? ctaImageDef
        : selectedBlock?.type === "cta-title"
          ? ctaTitleDef
          : selectedBlock?.type === "hero-cta"
            ? heroCtaDef
            : null
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <p className="text-[11px] leading-relaxed text-gray-500">
            Klik judul, gambar, atau tombol di canvas untuk mengedit. Drag box untuk
            geser posisi · handle biru/ungu untuk ubah ukuran.
          </p>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {selectedBlock.id.includes("secondary")
                  ? "Tombol Sekunder"
                  : selectedBlock.id.includes("primary")
                    ? "Tombol Utama"
                    : (selectedDef?.label ?? selectedBlock.type)}
              </span>
            </div>
            {selectedDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                {selectedBlock.type === "cta-image" && (
                  <>
                    <BlockSettingsFields
                      fields={selectedDef.fields}
                      settings={resolvedSettings ?? {}}
                      onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                    />
                    <p className="text-[11px] text-gray-500">
                      Posisi & ukuran: drag box atau handle biru di canvas.
                    </p>
                  </>
                )}
                {selectedBlock.type === "cta-title" && (
                  <>
                    <SettingsField label="Judul">
                      <SettingsInput
                        value={
                          (typeof resolvedSettings?.label === "string"
                            ? resolvedSettings.label
                            : instance.settings?.title) ?? ""
                        }
                        placeholder="Experience the Art of Less"
                        onChange={(e) =>
                          updateBlockSettings(selectedIdx, { label: e.target.value })
                        }
                      />
                    </SettingsField>
                    <p className="text-[11px] text-gray-500">
                      Edit teks langsung di canvas atau ubah ukuran box dengan handle biru.
                    </p>
                  </>
                )}
                {selectedBlock.type === "hero-cta" && heroCtaDef && (
                  <>
                    <SettingsField label="Teks Tombol">
                      <SettingsInput
                        value={(typeof resolvedSettings?.label === "string" ? resolvedSettings.label : "") ?? ""}
                        placeholder="Explore Collections"
                        onChange={(e) =>
                          updateBlockSettings(selectedIdx, { label: e.target.value })
                        }
                      />
                    </SettingsField>
                    <HeroCtaColorFields
                      settings={resolvedSettings}
                      primaryColor={config.primaryColor}
                      onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                    />
                    <p className="text-[11px] text-gray-500">
                      Posisi & ukuran tombol: tarik tepi/sudut di canvas.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (instance.type === "hero" && config.templateId === "fashion") {
    const heroMediaDef = blockDefs["hero-media"]
    const heroCtaDef = blockDefs["hero-cta"]
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const selectedDef =
      selectedBlock?.type === "hero-cta"
        ? heroCtaDef
        : selectedBlock?.type === "hero-media"
          ? heroMediaDef
          : null
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined
    const title1LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title1",
      device === "mobile",
    ).hPct
    const title2LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title2",
      device === "mobile",
    ).hPct

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik gambar hero atau tombol CTA di canvas untuk mengedit. Ukuran & posisi CTA
              diatur lewat handle resize di canvas.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul baris 1">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="Curated For Everyday Beauty"
                  onChange={(e) => onHeroChange("title", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Judul baris 2">
                <SettingsInput
                  value={config.hero?.subtitle ?? ""}
                  placeholder="New Season Arrival"
                  onChange={(e) => onHeroChange("subtitle", e.target.value)}
                />
              </SettingsField>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {selectedDef?.label ?? selectedBlock.type}
              </span>
            </div>
            {selectedDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                {selectedBlock.type === "hero-media" && (
                  <>
                    <HeroImageListPanel
                      images={parseCanvasImages(resolvedSettings)}
                      onChange={(imgs) => updateBlockSettings(selectedIdx, { images: imgs })}
                    />
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Judul
                      </p>
                      <SettingsField label="Judul baris 1">
                        <SettingsInput
                          value={config.hero?.title ?? ""}
                          placeholder="Curated For Everyday Beauty"
                          onChange={(e) => onHeroChange("title", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Judul baris 2">
                        <SettingsInput
                          value={config.hero?.subtitle ?? ""}
                          placeholder="New Season Arrival"
                          onChange={(e) => onHeroChange("subtitle", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 1" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={resolvedSettings?.title1Layer === "behind" ? "behind" : "front"}
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title1Layer: value })
                          }
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 2" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={resolvedSettings?.title2Layer === "behind" ? "behind" : "front"}
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title2Layer: value })
                          }
                        />
                      </SettingsField>
                    </div>
                    <SettingsField
                      label={`Ukuran font baris 1 (${Math.round(title1LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title1LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title1LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <SettingsField
                      label={`Ukuran font baris 2 (${Math.round(title2LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title2LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title2LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Styling Teks
                      </p>
                      <TitleStyleFields
                        line="title1"
                        lineLabel="baris 1"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                      <TitleStyleFields
                        line="title2"
                        lineLabel="baris 2"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                    </p>
                  </>
                )}
                {selectedBlock.type === "hero-cta" && (
                  <p className="text-[11px] text-gray-500">
                    Posisi & ukuran tombol: tarik tepi/sudut di canvas.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (instance.type === "hero" && config.templateId === "bento") {
    const heroMediaDef = blockDefs["hero-media"]
    const heroCtaDef = blockDefs["hero-cta"]
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const selectedDef =
      selectedBlock?.type === "hero-cta"
        ? heroCtaDef
        : selectedBlock?.type === "hero-media"
          ? heroMediaDef
          : null
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined
    const title1LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title1",
      device === "mobile",
    ).hPct
    const title2LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title2",
      device === "mobile",
    ).hPct

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik gambar hero atau tombol CTA di canvas untuk mengedit. Ukuran & posisi CTA
              diatur lewat handle resize di canvas.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul baris 1">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="Wireless"
                  onChange={(e) => onHeroChange("title", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Judul baris 2">
                <SettingsInput
                  value={config.hero?.subtitle ?? ""}
                  placeholder="Headphones"
                  onChange={(e) => onHeroChange("subtitle", e.target.value)}
                />
              </SettingsField>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {selectedDef?.label ?? selectedBlock.type}
              </span>
            </div>
            {selectedDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                {selectedBlock.type === "hero-media" && (
                  <>
                    <HeroImageListPanel
                      images={parseCanvasImages(resolvedSettings)}
                      onChange={(imgs) => updateBlockSettings(selectedIdx, { images: imgs })}
                    />
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Judul
                      </p>
                      <SettingsField label="Judul baris 1">
                        <SettingsInput
                          value={config.hero?.title ?? ""}
                          placeholder="Wireless"
                          onChange={(e) => onHeroChange("title", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Judul baris 2">
                        <SettingsInput
                          value={config.hero?.subtitle ?? ""}
                          placeholder="Headphones"
                          onChange={(e) => onHeroChange("subtitle", e.target.value)}
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 1" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={
                            resolvedSettings?.title1Layer === "behind" ? "behind" : "front"
                          }
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title1Layer: value })
                          }
                        />
                      </SettingsField>
                      <SettingsField label="Layer judul baris 2" hint="Urutan tampilan relatif ke gambar hero">
                        <SegmentedControl
                          value={
                            resolvedSettings?.title2Layer === "behind" ? "behind" : "front"
                          }
                          options={[...HERO_TITLE_LAYER_OPTIONS]}
                          onChange={(value) =>
                            updateBlockSettings(selectedIdx, { title2Layer: value })
                          }
                        />
                      </SettingsField>
                    </div>
                    <SettingsField
                      label={`Ukuran font baris 1 (${Math.round(title1LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title1LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title1LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <SettingsField
                      label={`Ukuran font baris 2 (${Math.round(title2LabelHPct * 10) / 10}% tinggi hero)`}
                      hint="Atur lewat slider atau tarik handle ungu di canvas"
                    >
                      <input
                        type="range"
                        min={4}
                        max={50}
                        step={0.5}
                        value={title2LabelHPct}
                        onChange={(event) =>
                          updateBlockSettings(selectedIdx, {
                            title2LabelHPct: Number(event.target.value),
                          })
                        }
                        className="h-1.5 w-full cursor-pointer accent-indigo-600"
                      />
                    </SettingsField>
                    <div className="space-y-3 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Styling Teks
                      </p>
                      <TitleStyleFields
                        line="title1"
                        lineLabel="baris 1"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                      <TitleStyleFields
                        line="title2"
                        lineLabel="baris 2"
                        settings={resolvedSettings}
                        onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                    </p>
                  </>
                )}
                {selectedBlock.type === "hero-cta" && (
                  <p className="text-[11px] text-gray-500">
                    Posisi & ukuran tombol: tarik tepi/sudut di canvas.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (instance.type === "hero" && config.templateId === "bold") {
    const heroMediaDef = blockDefs["hero-media"]
    const heroCtaDef = blockDefs["hero-cta"]
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const selectedDef =
      selectedBlock?.type === "hero-cta"
        ? heroCtaDef
        : selectedBlock?.type === "hero-media"
          ? heroMediaDef
          : null
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined
    const title1LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title1",
      device === "mobile",
    ).hPct
    const title2LabelHPct = parseHeroTitleLayout(
      resolvedSettings,
      "title2",
      device === "mobile",
    ).hPct

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik judul atau tombol CTA di canvas untuk mengedit. Ganti foto hero lewat panel
              Gambar Hero. Drag box judul untuk pindah posisi.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul baris 1">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="NO LIMITS."
                  onChange={(e) => onHeroChange("title", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Judul baris 2">
                <SettingsInput
                  value={config.hero?.subtitle ?? ""}
                  placeholder="MORE MOTION"
                  onChange={(e) => onHeroChange("subtitle", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Teks tombol CTA">
                <SettingsInput
                  value={config.hero?.ctaLabel ?? ""}
                  placeholder="SHOP NOW"
                  onChange={(e) => onHeroChange("ctaLabel", e.target.value)}
                />
              </SettingsField>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {selectedDef?.label ?? selectedBlock.type}
              </span>
            </div>
            {selectedDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                {selectedBlock.type === "hero-media" && (
                  <>
                <HeroImageListPanel
                  images={parseCanvasImages(resolvedSettings)}
                  onChange={(imgs) => updateBlockSettings(selectedIdx, { images: imgs })}
                />
                <SettingsField
                  label={`Zoom gambar (${Math.round(Number(resolvedSettings?.imgScale ?? 100))}%)`}
                  hint="Perbesar foto hero dari tengah — tanpa drag di canvas"
                >
                  <input
                    type="range"
                    min={100}
                    max={200}
                    step={5}
                    value={Number(resolvedSettings?.imgScale ?? 100)}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        imgScale: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Judul
                  </p>
                  <SettingsField label="Judul baris 1">
                    <SettingsInput
                      value={config.hero?.title ?? ""}
                      placeholder="NO LIMITS."
                      onChange={(e) => onHeroChange("title", e.target.value)}
                    />
                  </SettingsField>
                  <SettingsField label="Judul baris 2">
                    <SettingsInput
                      value={config.hero?.subtitle ?? ""}
                      placeholder="MORE MOTION"
                      onChange={(e) => onHeroChange("subtitle", e.target.value)}
                    />
                  </SettingsField>
                  <SettingsField label="Layer judul baris 1" hint="Urutan tampilan relatif ke gambar hero">
                    <SegmentedControl
                      value={resolvedSettings?.title1Layer === "behind" ? "behind" : "front"}
                      options={[...HERO_TITLE_LAYER_OPTIONS]}
                      onChange={(value) =>
                        updateBlockSettings(selectedIdx, { title1Layer: value })
                      }
                    />
                  </SettingsField>
                  <SettingsField label="Layer judul baris 2" hint="Urutan tampilan relatif ke gambar hero">
                    <SegmentedControl
                      value={resolvedSettings?.title2Layer === "behind" ? "behind" : "front"}
                      options={[...HERO_TITLE_LAYER_OPTIONS]}
                      onChange={(value) =>
                        updateBlockSettings(selectedIdx, { title2Layer: value })
                      }
                    />
                  </SettingsField>
                </div>
                <SettingsField
                  label={`Ukuran font baris 1 (${Math.round(title1LabelHPct * 10) / 10}% tinggi hero)`}
                  hint="Atur lewat slider atau tarik handle ungu di canvas"
                >
                  <input
                    type="range"
                    min={4}
                    max={50}
                    step={0.5}
                    value={title1LabelHPct}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        title1LabelHPct: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <SettingsField
                  label={`Ukuran font baris 2 (${Math.round(title2LabelHPct * 10) / 10}% tinggi hero)`}
                  hint="Atur lewat slider atau tarik handle ungu di canvas"
                >
                  <input
                    type="range"
                    min={4}
                    max={50}
                    step={0.5}
                    value={title2LabelHPct}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        title2LabelHPct: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Styling Teks
                  </p>
                  <TitleStyleFields
                    line="title1"
                    lineLabel="baris 1"
                    settings={resolvedSettings}
                    onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                  />
                  <TitleStyleFields
                    line="title2"
                    lineLabel="baris 2"
                    settings={resolvedSettings}
                    onChange={(patch) => updateBlockSettings(selectedIdx, patch)}
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                </p>
                  </>
                )}
                {selectedBlock.type === "hero-cta" && (
                  <>
                    <SettingsField label="Teks tombol CTA">
                      <SettingsInput
                        value={config.hero?.ctaLabel ?? ""}
                        placeholder="SHOP NOW"
                        onChange={(e) => onHeroChange("ctaLabel", e.target.value)}
                      />
                    </SettingsField>
                    <SettingsField
                      label={`Rounded tombol (${parseCtaRadius(resolvedSettings) ?? "default"}${parseCtaRadius(resolvedSettings) != null ? "px" : ""})`}
                      hint="Geser untuk atur lengkungan sudut tombol"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={MAX_CTA_RADIUS}
                          step={1}
                          value={parseCtaRadius(resolvedSettings) ?? 24}
                          onChange={(event) =>
                            updateBlockSettings(selectedIdx, {
                              ctaRadius: Number(event.target.value),
                            })
                          }
                          className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                        />
                        {parseCtaRadius(resolvedSettings) != null && (
                          <button
                            type="button"
                            onClick={() => updateBlockSettings(selectedIdx, { ctaRadius: "" })}
                            className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </SettingsField>
                    <p className="text-[11px] text-gray-500">
                      Posisi: drag tombol di canvas · ukuran: tarik tepi/sudut.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (instance.type === "hero") {
    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>
        <SettingsGroupsForm
          groups={HERO_SECTION_SETTINGS_GROUPS}
          config={config}
          onConfigChange={(key, value) =>
            onConfigChange({ ...config, [key]: value })
          }
          onHeroChange={onHeroChange}
        />
      </div>
    )
  }

  if (
    instance.type === "category-grid" &&
    (config.templateId === "bento" || config.templateId === "minimalist") &&
    selectedBlockId
  ) {
    const selectedBlock = currentBlocks.find((block) => block.id === selectedBlockId)
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1

    if (selectedBlock && selectedIdx >= 0) {
      const resolvedSettings = resolveDeviceSettings(
        selectedBlock.settings as Record<string, unknown> | undefined,
        device === "mobile",
      )
      const labelHPct = Number(resolvedSettings?.labelHPct ?? 20)

      return (
        <div className="border-t border-gray-200 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {label}
          </h4>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
              {device === "mobile" ? "Mobile" : "Desktop"}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {getBlockDisplayName(selectedBlock)}
            </span>
          </div>
          <div className="space-y-3">
            <BlockSettingsFields
              fields={
                getBlockDefinition(config.templateId, instance.type, selectedBlock.type)?.fields ??
                []
              }
              settings={resolvedSettings}
              onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
              blockIndex={selectedIdx}
            />
            {config.templateId === "bento" && (
              <>
                <SettingsField
                  label={`Rotasi gambar (${Math.round(Number(resolvedSettings?.imgRotation ?? 0))}°)`}
                >
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={Math.round(Number(resolvedSettings?.imgRotation ?? 0))}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        imgRotation: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <SettingsField
                  label={`Skala gambar (${Math.round(Number(resolvedSettings?.imgSliderScale ?? 1) * 100)}%)`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.05}
                      value={Number(resolvedSettings?.imgSliderScale ?? 1)}
                      onChange={(event) =>
                        updateBlockSettings(selectedIdx, {
                          imgSliderScale: Number(event.target.value),
                        })
                      }
                      className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => updateBlockSettings(selectedIdx, { imgSliderScale: 1 })}
                      className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                </SettingsField>
                <SettingsField label="Layer judul" hint="Urutan tampilan relatif ke gambar kartu">
                  <SegmentedControl
                    value={resolvedSettings?.labelLayer === "behind" ? "behind" : "front"}
                    options={[...LABEL_LAYER_OPTIONS]}
                    onChange={(value) => updateBlockSettings(selectedIdx, { labelLayer: value })}
                  />
                </SettingsField>
                <SettingsField
                  label={`Ukuran font judul (${Number.isFinite(labelHPct) ? Math.round(labelHPct * 10) / 10 : 20}% tinggi kartu)`}
                  hint="Atur lewat slider atau tarik handle ungu di canvas"
                >
                  <input
                    type="range"
                    min={4}
                    max={50}
                    step={0.5}
                    value={Number.isFinite(labelHPct) ? labelHPct : 20}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        labelHPct: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <p className="text-[11px] text-gray-500">
                  Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                </p>
              </>
            )}
            {config.templateId === "minimalist" && (
              <>
                <SettingsField
                  label={`Rotasi gambar (${Math.round(Number(resolvedSettings?.imgRotation ?? 0))}°)`}
                >
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={Math.round(Number(resolvedSettings?.imgRotation ?? 0))}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        imgRotation: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <SettingsField
                  label={`Skala gambar (${Math.round(Number(resolvedSettings?.imgSliderScale ?? 1) * 100)}%)`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.05}
                      value={Number(resolvedSettings?.imgSliderScale ?? 1)}
                      onChange={(event) =>
                        updateBlockSettings(selectedIdx, {
                          imgSliderScale: Number(event.target.value),
                        })
                      }
                      className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => updateBlockSettings(selectedIdx, { imgSliderScale: 1 })}
                      className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                </SettingsField>
                <SettingsField label="Layer judul" hint="Urutan tampilan relatif ke gambar kartu">
                  <SegmentedControl
                    value={resolvedSettings?.labelLayer === "behind" ? "behind" : "front"}
                    options={[...LABEL_LAYER_OPTIONS]}
                    onChange={(value) => updateBlockSettings(selectedIdx, { labelLayer: value })}
                  />
                </SettingsField>
                <SettingsField
                  label={`Ukuran font judul (${Number.isFinite(labelHPct) ? Math.round(labelHPct * 10) / 10 : 16}% tinggi kartu)`}
                  hint="Atur lewat slider atau tarik handle ungu di canvas"
                >
                  <input
                    type="range"
                    min={4}
                    max={50}
                    step={0.5}
                    value={Number.isFinite(labelHPct) ? labelHPct : 16}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        labelHPct: Number(event.target.value),
                      })
                    }
                    className="h-1.5 w-full cursor-pointer accent-indigo-600"
                  />
                </SettingsField>
                <p className="text-[11px] text-gray-500">
                  Posisi & lebar teks: drag box judul di canvas atau tarik handle ungu.
                </p>
              </>
            )}
          </div>
        </div>
      )
    }
  }

  if (
    instance.type === "category-cards" &&
    config.templateId === "fashion" &&
    selectedBlockId
  ) {
    const selectedBlock = currentBlocks.find((block) => block.id === selectedBlockId)
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1

    if (selectedBlock && selectedIdx >= 0) {
      const resolvedSettings = resolveDeviceSettings(
        selectedBlock.settings as Record<string, unknown> | undefined,
        device === "mobile",
      )

      return (
        <div className="border-t border-gray-200 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {label}
          </h4>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
              {device === "mobile" ? "Mobile" : "Desktop"}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {getBlockDisplayName(selectedBlock)}
            </span>
          </div>
          <div className="space-y-3">
            <BlockSettingsFields
              fields={
                getBlockDefinition(config.templateId, instance.type, selectedBlock.type)?.fields ??
                []
              }
              settings={resolvedSettings}
              onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
              blockIndex={selectedIdx}
            />
            <SettingsField
              label={`Rotasi gambar (${Math.round(Number(resolvedSettings?.imgRotation ?? 0))}°)`}
            >
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={Math.round(Number(resolvedSettings?.imgRotation ?? 0))}
                onChange={(event) =>
                  updateBlockSettings(selectedIdx, {
                    imgRotation: Number(event.target.value),
                  })
                }
                className="h-1.5 w-full cursor-pointer accent-indigo-600"
              />
            </SettingsField>
            <SettingsField
              label={`Skala gambar (${Math.round(Number(resolvedSettings?.imgSliderScale ?? 1) * 100)}%)`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0.1}
                  max={5}
                  step={0.05}
                  value={Number(resolvedSettings?.imgSliderScale ?? 1)}
                  onChange={(event) =>
                    updateBlockSettings(selectedIdx, {
                      imgSliderScale: Number(event.target.value),
                    })
                  }
                  className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => updateBlockSettings(selectedIdx, { imgSliderScale: 1 })}
                  className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  Reset
                </button>
              </div>
            </SettingsField>
            <p className="text-[11px] text-gray-500">
              Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
            </p>
          </div>
        </div>
      )
    }
  }

  if (instance.type === "image-layers" && config.templateId === "minimalist") {
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined
    const imageLayerDef = blockDefs["image-layer"]

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Tambah beberapa gambar ke kanvas. Setiap gambar bisa digeser, di-resize, dirotasi, dan di-zoom secara independen.
            </p>

            {currentBlocks.length > 0 ? (
              <ul className="mb-3 space-y-2">
                {currentBlocks.map((block, idx) => {
                  const imgUrl = (block.settings as Record<string, unknown> | undefined)?.imageUrl
                  return (
                    <li
                      key={block.id}
                      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-200">
                        {typeof imgUrl === "string" && imgUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="flex-1 truncate text-[11px] font-medium text-gray-700">
                        Gambar {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, -1)}
                        disabled={idx === 0}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                        aria-label="Ke belakang"
                        title="Ke belakang"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 1)}
                        disabled={idx === currentBlocks.length - 1}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                        aria-label="Ke depan"
                        title="Ke depan"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(idx)}
                        className="rounded p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                        aria-label="Hapus gambar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mb-3 text-center text-[11px] text-gray-400">
                Belum ada gambar. Klik tombol di bawah untuk menambah.
              </p>
            )}

            <button
              type="button"
              onClick={addBlock}
              disabled={atBlockLimit}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Gambar Baru
            </button>
            {atBlockLimit && (
              <p className="mt-1.5 text-center text-[10px] text-gray-400">
                Maks. {maxBlocks} gambar
              </p>
            )}
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-gray-200">
                {typeof resolvedSettings?.imageUrl === "string" && resolvedSettings.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvedSettings.imageUrl as string}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">Gambar {selectedIdx + 1}</span>
              <div className="ml-auto flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => moveBlock(selectedIdx, -1)}
                  disabled={selectedIdx === 0}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                  aria-label="Ke belakang"
                  title="Ke belakang"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(selectedIdx, 1)}
                  disabled={selectedIdx === currentBlocks.length - 1}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                  aria-label="Ke depan"
                  title="Ke depan"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
            </div>
            <div className="space-y-3">
              {imageLayerDef && (
                <BlockSettingsFields
                  fields={imageLayerDef.fields}
                  settings={resolvedSettings}
                  onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
                  blockIndex={selectedIdx}
                />
              )}
              <SettingsField
                label={`Rotasi (${Math.round(Number(resolvedSettings?.imgRotation ?? 0))}°)`}
              >
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={Math.round(Number(resolvedSettings?.imgRotation ?? 0))}
                  onChange={(event) =>
                    updateBlockSettings(selectedIdx, {
                      imgRotation: Number(event.target.value),
                    })
                  }
                  className="h-1.5 w-full cursor-pointer accent-indigo-600"
                />
              </SettingsField>
              <SettingsField
                label={`Skala (${Math.round(Number(resolvedSettings?.imgSliderScale ?? 1) * 100)}%)`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0.1}
                    max={5}
                    step={0.05}
                    value={Number(resolvedSettings?.imgSliderScale ?? 1)}
                    onChange={(event) =>
                      updateBlockSettings(selectedIdx, {
                        imgSliderScale: Number(event.target.value),
                      })
                    }
                    className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => updateBlockSettings(selectedIdx, { imgSliderScale: 1 })}
                    className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    Reset
                  </button>
                </div>
              </SettingsField>
              <p className="text-[11px] text-gray-500">
                Drag box di canvas untuk geser · handle biru untuk resize.
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  const hasTextSettings = sectionHasSettings(config.templateId, instance.type)

  if (!hasTextSettings && !hasBlocks) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-6 text-center">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="mt-1 text-xs text-gray-500">
          Section ini belum punya field konten yang bisa diedit.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        {label}
      </h4>

      {hasTextSettings && (
        <SectionSettingsFields
          templateId={config.templateId}
          sectionType={instance.type}
          settings={instance.settings}
          onChange={(settings) => onSectionSettingsChange(selectedSectionId, settings)}
        />
      )}

      {hasBlocks && firstBlockDef && (
        <div className={hasTextSettings ? "mt-4 border-t border-gray-100 pt-4" : ""}>
          {instance.type === "category-grid" &&
            (config.templateId === "bento" || config.templateId === "minimalist") && (
              <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
                {config.templateId === "bento"
                  ? `Maks. ${MAX_CATEGORY_CARDS} kartu. Edit di canvas — ukuran kartu & zoom gambar pakai handle resize.`
                  : `Maks. ${MAX_CATEGORY_CARDS} kartu. Edit di canvas — ukuran kartu & zoom gambar pakai handle resize.`}
              </p>
            )}
          {instance.type === "category-cards" && config.templateId === "fashion" && (
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik kartu di canvas untuk edit gambar & warna.
            </p>
          )}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              {firstBlockDef.label}s ({currentBlocks.length}
              {maxBlocks != null ? `/${maxBlocks}` : ""})
            </span>
            <button
              type="button"
              onClick={addBlock}
              disabled={atBlockLimit}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {currentBlocks.map((block, idx) => {
              const blockDef = getBlockDefinition(config.templateId, instance.type, block.type)
              const isExpanded = expandedBlockId === block.id

              return (
              <li
                key={block.id}
                className="rounded-md border border-gray-100 bg-gray-50"
              >
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                    className="flex-1 truncate text-left text-xs font-medium text-gray-700"
                  >
                    {getBlockDisplayName(block)}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, -1)}
                    disabled={idx === 0}
                    className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 1)}
                    disabled={idx === currentBlocks.length - 1}
                    className="rounded p-0.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="rounded p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {isExpanded && blockDef && (
                  <div className="px-2 pb-3">
                    <BlockSettingsFields
                      fields={blockDef.fields}
                      settings={block.settings as Record<string, unknown> | undefined}
                      onChange={(settings) => updateBlockSettings(idx, settings)}
                      blockIndex={idx}
                    />
                    {(config.templateId === "bento" || config.templateId === "minimalist") && instance.type === "category-grid" && (
                      <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                        <SettingsField
                          label={`Rotasi gambar (${Math.round(Number(resolveDeviceSettings(block.settings as Record<string, unknown> | undefined, device === "mobile")?.imgRotation ?? 0))}°)`}
                        >
                          <input
                            type="range"
                            min={-180}
                            max={180}
                            step={1}
                            value={Math.round(Number(resolveDeviceSettings(block.settings as Record<string, unknown> | undefined, device === "mobile")?.imgRotation ?? 0))}
                            onChange={(event) =>
                              updateBlockSettings(idx, { imgRotation: Number(event.target.value) })
                            }
                            className="h-1.5 w-full cursor-pointer accent-indigo-600"
                          />
                        </SettingsField>
                        <SettingsField
                          label={`Skala gambar (${Math.round(Number(resolveDeviceSettings(block.settings as Record<string, unknown> | undefined, device === "mobile")?.imgSliderScale ?? 1) * 100)}%)`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={0.1}
                              max={5}
                              step={0.05}
                              value={Number(resolveDeviceSettings(block.settings as Record<string, unknown> | undefined, device === "mobile")?.imgSliderScale ?? 1)}
                              onChange={(event) =>
                                updateBlockSettings(idx, { imgSliderScale: Number(event.target.value) })
                              }
                              className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
                            />
                            <button
                              type="button"
                              onClick={() => updateBlockSettings(idx, { imgSliderScale: 1 })}
                              className="shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                              Reset
                            </button>
                          </div>
                        </SettingsField>
                        <SettingsField
                          label="Layer judul"
                          hint="Urutan tampilan relatif ke gambar kartu"
                        >
                          <SegmentedControl
                            value={
                              resolveDeviceSettings(
                                block.settings as Record<string, unknown> | undefined,
                                device === "mobile",
                              )?.labelLayer === "behind"
                                ? "behind"
                                : "front"
                            }
                            options={[...LABEL_LAYER_OPTIONS]}
                            onChange={(value) =>
                              updateBlockSettings(idx, { labelLayer: value })
                            }
                          />
                        </SettingsField>
                        <p className="text-[11px] text-gray-500">
                          Posisi & ukuran teks: drag box judul di canvas atau tarik handle ungu.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )})}
          </ul>

          {currentBlocks.length === 0 && (
            <p className="mt-2 text-[11px] text-gray-400">
              Belum ada item. Klik Add untuk menambah.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
