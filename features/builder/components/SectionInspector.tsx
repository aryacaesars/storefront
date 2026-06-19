"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { BlockSettingsFields } from "@/features/builder/components/BlockSettingsFields"
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
import { applyDevicePatch, resolveDeviceSettings } from "@/themes/engine/device-settings"
import { parseHeroTitleLayout } from "@/themes/bento/sections/hero-title-layout"
import type { PreviewDevice } from "@/features/builder/components/EditorTopbar"
import type { BlockInstance, HeroConfig, SectionPageType, ThemeConfig } from "@/themes/engine/schema"

const HERO_TITLE_LAYER_OPTIONS = [
  { value: "front", label: "Di depan" },
  { value: "behind", label: "Di belakang" },
] as const

const LABEL_LAYER_OPTIONS = HERO_TITLE_LAYER_OPTIONS

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
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null)

  const maxBlocks =
    instance.type === "category-grid" &&
    (config.templateId === "bento" || config.templateId === "minimalist")
      ? MAX_CATEGORY_CARDS
      : undefined
  const atBlockLimit = maxBlocks != null && currentBlocks.length >= maxBlocks

  useEffect(() => {
    if (selectedBlockId) {
      setExpandedBlockId(selectedBlockId)
    }
  }, [selectedBlockId])

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

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik area hero untuk edit gambar · klik tombol CTA untuk edit warna & teks.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="Quiet Luxury for the Modern Individual"
                  onChange={(e) => onHeroChange("title", e.target.value)}
                />
              </SettingsField>
              <SettingsField label="Subjudul">
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
                <BlockSettingsFields
                  fields={selectedDef.fields}
                  settings={resolvedSettings}
                  onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
                />
                {selectedBlock.type === "hero-media" && (
                  <p className="text-[11px] text-gray-500">
                    Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
                  </p>
                )}
                {selectedBlock.type === "hero-cta" && (
                  <p className="text-[11px] text-gray-500">
                    Edit teks dan warna tombol di atas. Posisi tombol mengikuti layout hero.
                  </p>
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

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik area hero untuk edit gambar · klik tombol CTA untuk edit warna & teks.
            </p>
            <div className="space-y-3">
              <SettingsField label="Judul">
                <SettingsInput
                  value={config.hero?.title ?? ""}
                  placeholder="Curated For Everyday Beauty"
                  onChange={(e) => onHeroChange("title", e.target.value)}
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
                <BlockSettingsFields
                  fields={selectedDef.fields}
                  settings={resolvedSettings}
                  onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
                />
                {selectedBlock.type === "hero-media" && (
                  <p className="text-[11px] text-gray-500">
                    Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
                  </p>
                )}
                {selectedBlock.type === "hero-cta" && (
                  <p className="text-[11px] text-gray-500">
                    Edit teks dan warna tombol di atas. Klik area lain di canvas untuk batal pilih.
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
                <BlockSettingsFields
                  fields={selectedDef.fields}
                  settings={resolvedSettings}
                  onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
                />
                {selectedBlock.type === "hero-media" && (
                  <>
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
    const selectedBlock = selectedBlockId
      ? currentBlocks.find((block) => block.id === selectedBlockId)
      : null
    const selectedIdx = selectedBlock
      ? currentBlocks.findIndex((block) => block.id === selectedBlock.id)
      : -1
    const resolvedSettings = selectedBlock
      ? resolveDeviceSettings(selectedBlock.settings, device === "mobile")
      : undefined

    return (
      <div className="border-t border-gray-200 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {label}
        </h4>

        {!selectedBlock ? (
          <>
            <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
              Klik area hero untuk edit gambar · teks & tombol diatur di panel ini.
            </p>
            <SettingsGroupsForm
              groups={HERO_SECTION_SETTINGS_GROUPS}
              config={config}
              onConfigChange={(key, value) => onConfigChange({ ...config, [key]: value })}
              onHeroChange={onHeroChange}
            />
          </>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {device === "mobile" ? "Mobile" : "Desktop"}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {heroMediaDef?.label ?? selectedBlock.type}
              </span>
            </div>
            {heroMediaDef && selectedIdx >= 0 && (
              <div className="space-y-3">
                <BlockSettingsFields
                  fields={heroMediaDef.fields}
                  settings={resolvedSettings}
                  onChange={(settings) => updateBlockSettings(selectedIdx, settings)}
                />
                <p className="text-[11px] text-gray-500">
                  Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
                </p>
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
              <p className="text-[11px] text-gray-500">
                Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
              </p>
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
            <p className="text-[11px] text-gray-500">
              Drag gambar di canvas untuk geser · tarik handle ⊙ untuk zoom.
            </p>
          </div>
        </div>
      )
    }
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
                  : `Maks. ${MAX_CATEGORY_CARDS} kartu. Klik kartu di canvas untuk edit gambar & warna.`}
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
                    {config.templateId === "bento" && instance.type === "category-grid" && (
                      <div className="mt-3 border-t border-gray-100 pt-3">
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
