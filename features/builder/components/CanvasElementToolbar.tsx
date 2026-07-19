"use client"

import { useEffect, useState } from "react"
import {
  Crop,
  FlipHorizontal2,
  FlipVertical2,
  Loader2,
  Trash2,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CanvasFloatingToolbar } from "@/features/builder/components/canvas/CanvasFloatingToolbar"
import { resolvePageTemplate } from "@/themes/engine/page-template"
import { resolveDeviceSettings } from "@/themes/engine/device-settings"
import {
  canvasElementDomKey,
  type SelectedElement,
} from "@/themes/engine/section-editor"
import {
  parseCanvasImages,
  updateImageInArray,
  virtualBoxFromCrop,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import {
  deleteTextFromArray,
  parseCanvasTexts,
  stylePayloadToTextPatch,
  textItemToStylePayload,
  updateTextInArray,
  type CanvasTextItem,
} from "@/themes/engine/canvas-text"
import {
  applyHeroTitleStylePatch,
  extractHeroTitleStyle,
  HERO_TITLE_STYLE_KEYS,
} from "@/themes/bento/sections/hero-title-style"
import {
  heroTitleLayoutToPatch,
  parseHeroTitleLayout,
} from "@/themes/bento/sections/hero-title-layout"
import { HERO_DESIGN_HEIGHT } from "@/themes/bento/sections/hero-cta-layout"
import { HEADING_FONT_OPTIONS } from "@/lib/themes/fonts"
import type { SectionPageType, ThemeConfig } from "@/themes/engine/schema"

interface CanvasElementToolbarProps {
  config: ThemeConfig
  selectedPage: SectionPageType
  device: "desktop" | "mobile"
  element: SelectedElement
  croppingKey: string | null
  onCroppingKeyChange: (key: string | null) => void
  copiedTextStyle: Record<string, unknown> | null
  onCopiedTextStyleChange: (style: Record<string, unknown> | null) => void
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onPosition: () => void
  onDeselect: () => void
}

const TITLE_LINES = new Set(["title1", "title2"])

/** Font size di canvas = tinggi box × 0.72 (design px, HERO_DESIGN_HEIGHT). */
const FONT_BOX_RATIO = 0.72
const MIN_FONT_PX = 12
const MAX_FONT_PX = 320

type WeightOption = "light" | "normal" | "bold"

function weightToOption(weight: number): WeightOption {
  if (weight <= 300) return "light"
  if (weight >= 600) return "bold"
  return "normal"
}

const WEIGHT_VALUES: Record<WeightOption, number> = {
  light: 300,
  normal: 400,
  bold: 700,
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function CanvasElementToolbar({
  config,
  selectedPage,
  device,
  element,
  croppingKey,
  onCroppingKeyChange,
  copiedTextStyle,
  onCopiedTextStyleChange,
  onPatchBlock,
  onPosition,
  onDeselect,
}: CanvasElementToolbarProps) {
  const [removingBg, setRemovingBg] = useState(false)
  const [removeBgError, setRemoveBgError] = useState<string | null>(null)
  /** null = belum dicek; false = API key belum dikonfigurasi. */
  const [removeBgAvailable, setRemoveBgAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (element.kind !== "image" || removeBgAvailable !== null) return
    let cancelled = false
    fetch("/api/images/remove-background")
      .then((res) => res.json())
      .then((data: { available?: boolean }) => {
        if (!cancelled) setRemoveBgAvailable(Boolean(data.available))
      })
      .catch(() => {
        // Gagal cek — biarkan optimistic, POST akan fallback ke "belum tersedia".
      })
    return () => {
      cancelled = true
    }
  }, [element.kind, removeBgAvailable])

  // Copy/paste style via Ctrl+Shift+C / Ctrl+Shift+V — aktif hanya saat elemen
  // teks terseleksi; state dihitung fresh di handler supaya tidak stale.
  useEffect(() => {
    if (element.kind !== "text" || !element.itemId) return
    const itemId = element.itemId
    const isTitleLine = TITLE_LINES.has(itemId)

    function resolveSettings(): Record<string, unknown> | undefined {
      const blocks = resolvePageTemplate(config, selectedPage).sections[
        element.sectionId
      ]?.blocks
      const block = blocks?.find((b) => b.id === element.blockId)
      return resolveDeviceSettings(
        block?.settings as Record<string, unknown> | undefined,
        device === "mobile",
      ) as Record<string, unknown> | undefined
    }

    function onKey(e: KeyboardEvent) {
      if (!e.ctrlKey || !e.shiftKey || e.altKey || e.metaKey) return
      const k = e.key.toLowerCase()
      if (k !== "c" && k !== "v") return

      if (k === "c") {
        const settings = resolveSettings()
        const style = isTitleLine
          ? extractHeroTitleStyle(settings, itemId as "title1" | "title2")
          : (() => {
              const item = parseCanvasTexts(settings).find((t) => t.id === itemId)
              return item ? textItemToStylePayload(item) : null
            })()
        if (style) {
          e.preventDefault()
          onCopiedTextStyleChange(style)
        }
      } else if (copiedTextStyle) {
        e.preventDefault()
        if (isTitleLine) {
          onPatchBlock(
            element.sectionId,
            element.blockId,
            applyHeroTitleStylePatch(copiedTextStyle, itemId as "title1" | "title2"),
          )
        } else {
          const texts = parseCanvasTexts(resolveSettings())
          if (texts.some((t) => t.id === itemId)) {
            onPatchBlock(element.sectionId, element.blockId, {
              texts: updateTextInArray(
                texts,
                itemId,
                stylePayloadToTextPatch(copiedTextStyle),
              ),
            })
          }
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [
    element,
    config,
    selectedPage,
    device,
    copiedTextStyle,
    onCopiedTextStyleChange,
    onPatchBlock,
  ])

  const template = resolvePageTemplate(config, selectedPage)
  const block = template.sections[element.sectionId]?.blocks?.find(
    (b) => b.id === element.blockId,
  )
  if (!block) return null

  const settings = resolveDeviceSettings(
    block.settings as Record<string, unknown> | undefined,
    device === "mobile",
  ) as Record<string, unknown> | undefined

  const patch = (p: Record<string, unknown>) =>
    onPatchBlock(element.sectionId, element.blockId, p)

  const domKey = canvasElementDomKey(element)
  const isCropping = croppingKey === domKey

  async function removeBackground(src: string, apply: (url: string) => void) {
    setRemovingBg(true)
    setRemoveBgError(null)
    try {
      const res = await fetch("/api/images/remove-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: src }),
      })
      if (res.status === 503) {
        // API key belum diset — bukan error, tampilkan "belum tersedia".
        setRemoveBgAvailable(false)
        return
      }
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Gagal menghapus background.")
      }
      apply(data.url)
    } catch (err) {
      setRemoveBgError(
        err instanceof Error ? err.message : "Gagal menghapus background.",
      )
    } finally {
      setRemovingBg(false)
    }
  }

  let editPanel: React.ReactNode
  let colorPanel: React.ReactNode
  let onCopyStyle: (() => void) | undefined

  if (element.kind === "image" && element.itemId) {
    // ── Multi-image canvas item ────────────────────────────────────────────────
    const items = parseCanvasImages(settings)
    const item = items.find((img) => img.id === element.itemId)
    if (!item) return null

    const patchItem = (p: Partial<CanvasImageItem>) =>
      patch({ images: updateImageInArray(items, item.id, p) })

    const resetCrop = () => {
      const virtual = virtualBoxFromCrop(item)
      patch({
        images: updateImageInArray(items, item.id, {
          x: Math.round(virtual.x * 10) / 10,
          y: Math.round(virtual.y * 10) / 10,
          width: Math.round(virtual.width * 10) / 10,
          height: Math.round(virtual.height * 10) / 10,
          crop: undefined,
        }),
      })
    }

    editPanel = (
      <div className="space-y-3">
        <PanelSlider
          label="Opacity"
          value={item.opacity}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patchItem({ opacity: v })}
        />
        <PanelRow label="Flip">
          <PanelIconToggle
            label="Flip horizontal"
            active={item.flipH}
            onClick={() => patchItem({ flipH: !item.flipH })}
          >
            <FlipHorizontal2 className="h-3.5 w-3.5" />
          </PanelIconToggle>
          <PanelIconToggle
            label="Flip vertical"
            active={item.flipV}
            onClick={() => patchItem({ flipV: !item.flipV })}
          >
            <FlipVertical2 className="h-3.5 w-3.5" />
          </PanelIconToggle>
        </PanelRow>
        <PanelSlider
          label="Rotasi"
          value={item.rotation}
          min={-180}
          max={180}
          step={1}
          suffix="°"
          onChange={(v) => patchItem({ rotation: v })}
        />
        <PanelRow label="Crop">
          <button
            type="button"
            onClick={() => onCroppingKeyChange(isCropping ? null : domKey)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium transition-colors",
              isCropping
                ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
          >
            <Crop className="h-3.5 w-3.5" />
            {isCropping ? "Selesai" : "Crop"}
          </button>
          {item.crop && (
            <button
              type="button"
              onClick={resetCrop}
              className="inline-flex h-7 items-center rounded-lg border border-gray-200 px-2.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          )}
        </PanelRow>
        <div className="border-t border-gray-100 pt-3">
          <RemoveBgAction
            available={removeBgAvailable}
            removing={removingBg}
            error={removeBgError}
            onClick={() => removeBackground(item.src, (url) => patchItem({ src: url }))}
          />
        </div>
      </div>
    )
  } else if (element.kind === "image") {
    // ── Legacy single image (imgX/imgY/imgScale transform) ─────────────────────
    const opacity = num(settings?.imgOpacity, 100)
    const rotation = num(settings?.imgRotation, 0)
    const flipH = settings?.imgFlipH === true
    const flipV = settings?.imgFlipV === true
    const imageUrl = typeof settings?.imageUrl === "string" ? settings.imageUrl : ""

    editPanel = (
      <div className="space-y-3">
        <PanelSlider
          label="Opacity"
          value={opacity}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patch({ imgOpacity: v })}
        />
        <PanelRow label="Flip">
          <PanelIconToggle
            label="Flip horizontal"
            active={flipH}
            onClick={() => patch({ imgFlipH: !flipH })}
          >
            <FlipHorizontal2 className="h-3.5 w-3.5" />
          </PanelIconToggle>
          <PanelIconToggle
            label="Flip vertical"
            active={flipV}
            onClick={() => patch({ imgFlipV: !flipV })}
          >
            <FlipVertical2 className="h-3.5 w-3.5" />
          </PanelIconToggle>
        </PanelRow>
        <PanelSlider
          label="Rotasi"
          value={rotation}
          min={-180}
          max={180}
          step={1}
          suffix="°"
          onChange={(v) => patch({ imgRotation: v })}
        />
        {imageUrl && (
          <div className="border-t border-gray-100 pt-3">
            <RemoveBgAction
              available={removeBgAvailable}
              removing={removingBg}
              error={removeBgError}
              onClick={() => removeBackground(imageUrl, (url) => patch({ imageUrl: url }))}
            />
          </div>
        )}
      </div>
    )
  } else if (element.kind === "text" && element.itemId && TITLE_LINES.has(element.itemId)) {
    // ── Hero title line typography ─────────────────────────────────────────────
    const line = element.itemId as "title1" | "title2"
    const key = (suffix: string) => `${line}${suffix}`
    const val = (suffix: string) => settings?.[key(suffix)]

    const fontFamily = typeof val("FontFamily") === "string" ? (val("FontFamily") as string) : ""
    const fontWeight = num(val("FontWeight"), 700)
    const weightOption = weightToOption(fontWeight)
    const italic = val("FontStyle") === "italic"
    const underline = val("TextDecoration") === "underline"
    const uppercase = val("TextTransform") === "uppercase"
    const sizeScale = num(val("SizeScale"), 1)
    const letterSpacing = num(val("LetterSpacing"), 0)
    const lineHeight = num(val("LineHeight"), 1.05)
    const opacity = num(val("Opacity"), 100)
    const color = typeof val("Color") === "string" ? (val("Color") as string) : "#ffffff"
    const copyableStyle = extractHeroTitleStyle(settings, line)

    // Ukuran font (design px) ↔ tinggi box label — sumber data sama dengan
    // resize handle di canvas, jadi dua arah selalu sinkron.
    const layout = parseHeroTitleLayout(settings, line, device === "mobile")
    const fontPx = Math.round(
      HERO_DESIGN_HEIGHT * (layout.hPct / 100) * FONT_BOX_RATIO * sizeScale,
    )
    const setFontPx = (px: number) => {
      if (!Number.isFinite(px)) return
      const clamped = Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, px))
      const hPct = (clamped / (FONT_BOX_RATIO * sizeScale) / HERO_DESIGN_HEIGHT) * 100
      patch(heroTitleLayoutToPatch(line, { hPct: Math.round(hPct * 10) / 10 }))
    }

    editPanel = (
      <div className="space-y-3">
        <PanelRow label="Font">
          <select
            value={fontFamily}
            onChange={(e) => patch({ [key("FontFamily")]: e.target.value })}
            className="h-7 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-800 outline-none focus:border-indigo-300"
          >
            <option value="">Default tema</option>
            {HEADING_FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </PanelRow>
        <PanelRow label="Weight">
          <div className="flex flex-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {(["light", "normal", "bold"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => patch({ [key("FontWeight")]: WEIGHT_VALUES[option] })}
                className={cn(
                  "h-6 flex-1 rounded-md text-[11px] capitalize transition-colors",
                  option === "light" && "font-light",
                  option === "normal" && "font-normal",
                  option === "bold" && "font-bold",
                  weightOption === option
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </PanelRow>
        <PanelRow label="Ukuran">
          <input
            type="number"
            value={fontPx}
            min={MIN_FONT_PX}
            max={MAX_FONT_PX}
            onChange={(e) => setFontPx(Number(e.target.value))}
            className="h-7 w-20 rounded-lg border border-gray-200 bg-white px-2 text-[11px] tabular-nums text-gray-800 outline-none focus:border-indigo-300"
          />
          <span className="text-[10px] font-medium text-gray-400">px</span>
        </PanelRow>
        <PanelRow label="Gaya">
          <PanelIconToggle
            label="Italic"
            active={italic}
            onClick={() => patch({ [key("FontStyle")]: italic ? "normal" : "italic" })}
          >
            <span className="text-[11px] italic">I</span>
          </PanelIconToggle>
          <PanelIconToggle
            label="Underline"
            active={underline}
            onClick={() =>
              patch({ [key("TextDecoration")]: underline ? "none" : "underline" })
            }
          >
            <span className="text-[11px] underline">U</span>
          </PanelIconToggle>
          <PanelIconToggle
            label="Uppercase"
            active={uppercase}
            onClick={() =>
              patch({ [key("TextTransform")]: uppercase ? "none" : "uppercase" })
            }
          >
            <span className="text-[10px] font-semibold">AA</span>
          </PanelIconToggle>
        </PanelRow>
        <PanelSlider
          label="Letter spacing"
          value={letterSpacing}
          min={-0.1}
          max={0.5}
          step={0.01}
          suffix="em"
          onChange={(v) => patch({ [key("LetterSpacing")]: v })}
        />
        <PanelSlider
          label="Line spacing"
          value={lineHeight}
          min={0.8}
          max={2}
          step={0.05}
          onChange={(v) => patch({ [key("LineHeight")]: v })}
        />
        <PanelSlider
          label="Opacity"
          value={opacity}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patch({ [key("Opacity")]: v })}
        />
        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          <button
            type="button"
            disabled={!copyableStyle}
            onClick={() => onCopiedTextStyleChange(copyableStyle)}
            className="inline-flex h-7 w-full items-center justify-center rounded-lg border border-gray-200 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copyableStyle ? "Salin style teks ini" : "Belum ada style custom"}
          </button>
          <button
            type="button"
            onClick={() => {
              const reset: Record<string, unknown> = {}
              for (const k of HERO_TITLE_STYLE_KEYS) reset[key(k)] = ""
              patch(reset)
            }}
            className="inline-flex h-7 w-full items-center justify-center rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 hover:bg-gray-50"
          >
            Reset style ke default tema
          </button>
          <button
            type="button"
            onClick={() => {
              patch({ [key("Hidden")]: true })
              onDeselect()
            }}
            className="inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 text-[11px] font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus teks
          </button>
          <p className="text-center text-[10px] text-gray-400">
            Copy: Ctrl+Shift+C · Paste: Ctrl+Shift+V
          </p>
        </div>
      </div>
    )

    colorPanel = (
      <ColorPickerPanel
        label="Warna teks"
        value={color}
        onChange={(v) => patch({ [key("Color")]: v })}
      />
    )

    if (copyableStyle) {
      onCopyStyle = () => onCopiedTextStyleChange(copyableStyle)
    }
  } else if (element.kind === "text" && element.itemId) {
    // ── Teks bebas (canvas text item) ──────────────────────────────────────────
    const texts = parseCanvasTexts(settings)
    const item = texts.find((t) => t.id === element.itemId)
    if (!item) return null

    const patchText = (p: Partial<CanvasTextItem>) =>
      patch({ texts: updateTextInArray(texts, item.id, p) })

    const weightOption = weightToOption(item.fontWeight ?? 700)

    editPanel = (
      <div className="space-y-3">
        <PanelRow label="Font">
          <select
            value={item.fontFamily ?? ""}
            onChange={(e) =>
              patchText({ fontFamily: e.target.value || undefined })
            }
            className="h-7 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-800 outline-none focus:border-indigo-300"
          >
            <option value="">Default tema</option>
            {HEADING_FONT_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </PanelRow>
        <PanelRow label="Weight">
          <div className="flex flex-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {(["light", "normal", "bold"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => patchText({ fontWeight: WEIGHT_VALUES[option] })}
                className={cn(
                  "h-6 flex-1 rounded-md text-[11px] capitalize transition-colors",
                  option === "light" && "font-light",
                  option === "normal" && "font-normal",
                  option === "bold" && "font-bold",
                  weightOption === option
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </PanelRow>
        <PanelRow label="Ukuran">
          <input
            type="number"
            value={item.fontSize}
            min={MIN_FONT_PX}
            max={MAX_FONT_PX}
            onChange={(e) => {
              const px = Number(e.target.value)
              if (!Number.isFinite(px)) return
              patchText({
                fontSize: Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, px)),
              })
            }}
            className="h-7 w-20 rounded-lg border border-gray-200 bg-white px-2 text-[11px] tabular-nums text-gray-800 outline-none focus:border-indigo-300"
          />
          <span className="text-[10px] font-medium text-gray-400">px</span>
        </PanelRow>
        <PanelRow label="Gaya">
          <PanelIconToggle
            label="Italic"
            active={item.fontStyle === "italic"}
            onClick={() =>
              patchText({
                fontStyle: item.fontStyle === "italic" ? "normal" : "italic",
              })
            }
          >
            <span className="text-[11px] italic">I</span>
          </PanelIconToggle>
          <PanelIconToggle
            label="Underline"
            active={item.textDecoration === "underline"}
            onClick={() =>
              patchText({
                textDecoration:
                  item.textDecoration === "underline" ? "none" : "underline",
              })
            }
          >
            <span className="text-[11px] underline">U</span>
          </PanelIconToggle>
          <PanelIconToggle
            label="Uppercase"
            active={item.textTransform === "uppercase"}
            onClick={() =>
              patchText({
                textTransform:
                  item.textTransform === "uppercase" ? "none" : "uppercase",
              })
            }
          >
            <span className="text-[10px] font-semibold">AA</span>
          </PanelIconToggle>
        </PanelRow>
        <PanelSlider
          label="Letter spacing"
          value={item.letterSpacing ?? 0}
          min={-0.1}
          max={0.5}
          step={0.01}
          suffix="em"
          onChange={(v) => patchText({ letterSpacing: v })}
        />
        <PanelSlider
          label="Line spacing"
          value={item.lineHeight ?? 1.1}
          min={0.8}
          max={2}
          step={0.05}
          onChange={(v) => patchText({ lineHeight: v })}
        />
        <PanelSlider
          label="Opacity"
          value={item.opacity ?? 100}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patchText({ opacity: v })}
        />
        <div className="border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => {
              patch({ texts: deleteTextFromArray(texts, item.id) })
              onDeselect()
            }}
            className="inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 text-[11px] font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus teks
          </button>
          <p className="mt-1.5 text-center text-[10px] text-gray-400">
            Copy: Ctrl+Shift+C · Paste: Ctrl+Shift+V
          </p>
        </div>
      </div>
    )

    colorPanel = (
      <ColorPickerPanel
        label="Warna teks"
        value={item.color ?? "#111111"}
        onChange={(v) => patchText({ color: v })}
      />
    )

    const payload = textItemToStylePayload(item)
    if (payload) {
      onCopyStyle = () => onCopiedTextStyleChange(payload)
    }
  } else if (element.kind === "button") {
    // ── Hero CTA button ────────────────────────────────────────────────────────
    const label = typeof settings?.label === "string" ? settings.label : ""
    const wPct = num(settings?.wPct, 24)
    const hPx = num(settings?.hPx, 56)
    const bgColor =
      typeof settings?.ctaBgColor === "string" && settings.ctaBgColor
        ? settings.ctaBgColor
        : "#ffffff"
    const textColor =
      typeof settings?.ctaTextColor === "string" && settings.ctaTextColor
        ? settings.ctaTextColor
        : "#4f46e5"

    editPanel = (
      <div className="space-y-3">
        <PanelRow label="Label">
          <input
            type="text"
            value={label}
            placeholder="Teks tombol"
            onChange={(e) => patch({ label: e.target.value })}
            className="h-7 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-800 outline-none focus:border-indigo-300"
          />
        </PanelRow>
        <PanelSlider
          label="Lebar"
          value={wPct}
          min={10}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patch({ wPct: v })}
        />
        <PanelSlider
          label="Tinggi"
          value={hPx}
          min={36}
          max={120}
          step={1}
          suffix="px"
          onChange={(v) => patch({ hPx: v })}
        />
      </div>
    )

    colorPanel = (
      <div className="space-y-4">
        <ColorPickerPanel
          label="Warna tombol"
          value={bgColor}
          onChange={(v) => patch({ ctaBgColor: v })}
        />
        <ColorPickerPanel
          label="Warna teks"
          value={textColor}
          onChange={(v) => patch({ ctaTextColor: v })}
        />
      </div>
    )
  }

  return (
    <CanvasFloatingToolbar
      element={element}
      onPosition={onPosition}
      onDeselect={() => {
        onCroppingKeyChange(null)
        onDeselect()
      }}
      editPanel={editPanel}
      colorPanel={colorPanel}
      onCopyStyle={onCopyStyle}
    />
  )
}

// ── Small panel primitives ─────────────────────────────────────────────────────

function RemoveBgAction({
  available,
  removing,
  error,
  onClick,
}: {
  available: boolean | null
  removing: boolean
  error: string | null
  onClick: () => void
}) {
  if (available === false) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-center">
        <p className="text-[11px] font-medium text-gray-500">
          Remove background — fitur belum tersedia
        </p>
      </div>
    )
  }
  return (
    <>
      <button
        type="button"
        disabled={removing}
        onClick={onClick}
        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {removing ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Wand2 className="h-3.5 w-3.5" />
        )}
        Remove background
        <span className="rounded-full bg-indigo-600 px-1.5 py-px text-[9px] font-bold uppercase text-white">
          Beta
        </span>
      </button>
      {error && (
        <p className="mt-1.5 text-[10px] font-medium text-red-600">{error}</p>
      )}
    </>
  )
}

const COLOR_PRESETS = [
  "#000000", "#ffffff", "#6b7280", "#ef4444", "#f97316", "#f59e0b",
  "#22c55e", "#14b8a6", "#3b82f6", "#4f46e5", "#8b5cf6", "#ec4899",
]

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/

/** Warna aman untuk <input type="color"> (butuh #rrggbb valid). */
function toPickerHex(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"
}

function ColorPickerPanel({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  if (lastValue !== value) {
    setLastValue(value)
    setDraft(value)
  }

  const commitDraft = () => {
    const next = draft.startsWith("#") ? draft : `#${draft}`
    if (HEX_RE.test(next)) onChange(next)
    else setDraft(value)
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-label={`Warna ${preset}`}
            onClick={() => onChange(preset)}
            className={cn(
              "h-7 w-7 rounded-full border border-gray-200 transition-transform hover:scale-110",
              value.toLowerCase() === preset &&
                "ring-2 ring-indigo-500 ring-offset-1",
            )}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 shadow-sm">
          <input
            type="color"
            aria-label={`${label} — custom`}
            value={toPickerHex(value)}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 h-12 w-12 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={draft}
          placeholder="#000000"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commitDraft()
            }
          }}
          className="h-8 flex-1 rounded-lg border border-gray-200 px-2 font-mono text-[11px] text-gray-800 outline-none focus:border-indigo-300"
        />
      </div>
    </div>
  )
}

function PanelRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="flex flex-1 items-center gap-1.5">{children}</div>
    </div>
  )
}

function PanelSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <PanelRow label={label}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer accent-indigo-600"
      />
      <span className="w-12 shrink-0 text-right text-[10px] font-medium tabular-nums text-gray-600">
        {value}
        {suffix ?? ""}
      </span>
    </PanelRow>
  )
}

function PanelIconToggle({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 w-8 items-center justify-center rounded-lg border transition-colors",
        active
          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
          : "border-gray-200 text-gray-600 hover:bg-gray-50",
      )}
    >
      {children}
    </button>
  )
}
