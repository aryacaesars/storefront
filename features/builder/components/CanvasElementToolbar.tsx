"use client"

import { useEffect, useState } from "react"
import {
  Crop,
  FlipHorizontal2,
  FlipVertical2,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
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
  deleteImageFromArray,
  isImageHeroBackground,
  parseCanvasImages,
  toggleImageHeroBackground,
  updateImageInArray,
  virtualBoxFromCrop,
  type CanvasImageItem,
} from "@/themes/engine/canvas-image"
import {
  deleteTextFromArray,
  stylePayloadToTextPatch,
  textItemToStylePayload,
  updateTextInArray,
  type CanvasTextItem,
} from "@/themes/engine/canvas-text"
import {
  deleteButtonFromArray,
  updateButtonInArray,
  MAX_BUTTON_HEIGHT,
  MIN_BUTTON_HEIGHT,
  type CanvasButtonItem,
} from "@/themes/engine/canvas-button"
import {
  resolveSectionCanvasButtons,
  resolveSectionCanvasTexts,
} from "@/themes/engine/cta-canvas"
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
  storeId?: string
  onCroppingKeyChange: (key: string | null) => void
  copiedTextStyle: Record<string, unknown> | null
  onCopiedTextStyleChange: (style: Record<string, unknown> | null) => void
  onPatchBlock: (
    sectionId: string,
    blockId: string,
    patch: Record<string, unknown>,
  ) => void
  onPosition: () => void
  /** Buka panel warna di sidebar (bukan dropdown toolbar). */
  onColor: () => void
  onDeselect: () => void
  /** Mobile Canva chrome — contextual strip above bottom nav. */
  mobile?: boolean
}

const TITLE_LINES = new Set(["title1", "title2"])

/** Font size di canvas = tinggi box × 0.72 (design px, HERO_DESIGN_HEIGHT). */
const FONT_BOX_RATIO = 0.72
const MIN_FONT_PX = 10
const MAX_FONT_PX = 1000

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
  storeId,
  onCroppingKeyChange,
  copiedTextStyle,
  onCopiedTextStyleChange,
  onPatchBlock,
  onPosition,
  onColor,
  onDeselect,
  mobile = false,
}: CanvasElementToolbarProps) {
  const [removingBg, setRemovingBg] = useState(false)
  const [removeBgError, setRemoveBgError] = useState<string | null>(null)
  /** null = belum dicek; false = API key belum dikonfigurasi. */
  const [removeBgAvailable, setRemoveBgAvailable] = useState<boolean | null>(null)
  const [replacingImage, setReplacingImage] = useState(false)

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

    function resolveTexts(): CanvasTextItem[] {
      const instance = resolvePageTemplate(config, selectedPage).sections[
        element.sectionId
      ]
      const block = instance?.blocks?.find((b) => b.id === element.blockId)
      const settings = resolveDeviceSettings(
        block?.settings as Record<string, unknown> | undefined,
        device === "mobile",
      ) as Record<string, unknown> | undefined
      return resolveSectionCanvasTexts(
        config.templateId,
        instance?.type,
        instance?.settings as Record<string, unknown> | undefined,
        settings,
      )
    }

    function resolveHeroSettings(): Record<string, unknown> | undefined {
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
        const style = isTitleLine
          ? extractHeroTitleStyle(resolveHeroSettings(), itemId as "title1" | "title2")
          : (() => {
              const item = resolveTexts().find((t) => t.id === itemId)
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
          const texts = resolveTexts()
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
  const instance = template.sections[element.sectionId]
  const block = instance?.blocks?.find((b) => b.id === element.blockId)
  if (!block) return null

  const sectionSettings = instance?.settings as Record<string, unknown> | undefined

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
  let hasColor = false
  let onCopyStyle: (() => void) | undefined

  if (element.kind === "frame") {
    // ── Card & latar hero (settings block hero-media) ──────────────────────────
    // bento/minimalist: card rounded + latar section terpisah; bold/fashion:
    // frame full-bleed = latar hero (satu warna).
    const hasCardWrapper =
      config.templateId === "bento" || config.templateId === "minimalist"
    hasColor = true

    editPanel = (
      <div className="space-y-3">
        <p className="text-[11px] leading-snug text-gray-500">
          {hasCardWrapper
            ? "Atur warna card hero dan latar section lewat panel Warna di sidebar."
            : "Atur warna latar hero lewat panel Warna di sidebar."}
        </p>
        <button
          type="button"
          onClick={() =>
            patch({
              frameBgColor: "",
              frameBgColor2: "",
              frameBgMode: "",
              frameBgAngle: "",
              sectionBgColor: "",
            })
          }
          className="inline-flex h-7 w-full items-center justify-center rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 hover:bg-gray-50"
        >
          Reset warna ke default tema
        </button>
      </div>
    )
  } else if (element.kind === "image" && element.itemId) {
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

    const isBackground = isImageHeroBackground(item)

    const toggleBackground = () => {
      const nextImages = toggleImageHeroBackground(items, item.id)
      const nextItem = nextImages.find((img) => img.id === item.id)
      patch({
        images: nextImages,
        // Bold / legacy readers also look at imageUrl for full-bleed.
        imageUrl: nextItem && isImageHeroBackground(nextItem) ? nextItem.src : "",
      })
    }

    const replaceImage = () => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/png,image/jpeg,image/webp,image/svg+xml"
      input.onchange = () => {
        const file = input.files?.[0]
        if (!file) return
        void (async () => {
          setReplacingImage(true)
          setRemoveBgError(null)
          try {
            const form = new FormData()
            form.append("file", file)
            if (storeId) form.append("storeId", storeId)
            const res = await fetch("/api/upload", { method: "POST", body: form })
            const data = (await res.json()) as { url?: string; error?: string }
            if (!res.ok || !data.url) {
              throw new Error(data.error ?? "Upload gagal")
            }
            // Mobile: foto baru khusus device ini. Desktop: shared src.
            patchItem(
              device === "mobile"
                ? { src: data.url, srcOverride: true }
                : { src: data.url, srcOverride: undefined },
            )
          } catch (err) {
            setRemoveBgError(
              err instanceof Error ? err.message : "Gagal ganti foto.",
            )
          } finally {
            setReplacingImage(false)
          }
        })()
      }
      input.click()
    }

    editPanel = (
      <div className="space-y-3">
        <button
          type="button"
          onClick={toggleBackground}
          className={cn(
            "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors",
            isBackground
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
          )}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {isBackground ? "Kembalikan ukuran normal" : "Jadikan background hero"}
        </button>
        <button
          type="button"
          disabled={replacingImage}
          onClick={replaceImage}
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          {replacingImage ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {device === "mobile" ? "Ganti foto (khusus mobile)" : "Ganti foto"}
        </button>
        {device === "mobile" && (
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2">
            <input
              type="checkbox"
              checked={item.srcOverride === true}
              onChange={(e) => {
                if (e.target.checked) {
                  patchItem({ srcOverride: true })
                } else {
                  patchItem({ srcOverride: undefined })
                }
              }}
              className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] leading-snug text-gray-600">
              Foto terpisah dari desktop
              <span className="mt-0.5 block text-[10px] text-gray-400">
                Matikan untuk ikut foto desktop lagi
              </span>
            </span>
          </label>
        )}
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
            onClick={() =>
              removeBackground(item.src, (url) =>
                patchItem(
                  device === "mobile"
                    ? { src: url, srcOverride: true }
                    : { src: url },
                ),
              )
            }
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const next = deleteImageFromArray(items, item.id)
            patch({
              images: next,
              ...(next.length === 0 ? { imageUrl: "" } : {}),
            })
            onDeselect()
            onCroppingKeyChange(null)
          }}
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus gambar
        </button>
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
        {imageUrl && (
          <button
            type="button"
            onClick={() => {
              patch({ imageUrl: "", images: [] })
              onDeselect()
            }}
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus gambar
          </button>
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

    hasColor = true

    if (copyableStyle) {
      onCopyStyle = () => onCopiedTextStyleChange(copyableStyle)
    }
  } else if (
    element.kind === "text" &&
    element.itemId === "label" &&
    block.type === "category-card"
  ) {
    // ── Label kartu kategori ───────────────────────────────────────────────────
    const label = typeof settings?.label === "string" ? settings.label : ""
    const labelLayer = settings?.labelLayer === "behind" ? "behind" : "front"

    editPanel = (
      <div className="space-y-3">
        <PanelRow label="Label">
          <input
            type="text"
            value={label}
            placeholder="Judul kategori"
            onChange={(e) => patch({ label: e.target.value })}
            className="h-7 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-800 outline-none focus:border-indigo-300"
          />
        </PanelRow>
        <PanelRow label="Layer">
          <div className="flex flex-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {(["front", "behind"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => patch({ labelLayer: option })}
                className={cn(
                  "h-6 flex-1 rounded-md text-[11px] transition-colors",
                  labelLayer === option
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800",
                )}
              >
                {option === "front" ? "Depan gambar" : "Belakang gambar"}
              </button>
            ))}
          </div>
        </PanelRow>
        <p className="text-[10px] text-gray-400">
          Ukuran & posisi label: drag box label / handle ungu di kartu.
        </p>
      </div>
    )
  } else if (element.kind === "text" && element.itemId) {
    // ── Teks bebas (canvas text item) ──────────────────────────────────────────
    const texts = resolveSectionCanvasTexts(
      config.templateId,
      instance?.type,
      sectionSettings,
      settings,
    )
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

    hasColor = true

    const payload = textItemToStylePayload(item)
    if (payload) {
      onCopyStyle = () => onCopiedTextStyleChange(payload)
    }
  } else if (element.kind === "button" && element.itemId) {
    // ── Tombol canvas (buttons[] item) ─────────────────────────────────────────
    const buttons = resolveSectionCanvasButtons(
      config.templateId,
      instance?.type,
      sectionSettings,
      settings,
    )
    const item = buttons.find((b) => b.id === element.itemId)
    if (!item) return null

    const patchButton = (p: Partial<CanvasButtonItem>) =>
      patch({ buttons: updateButtonInArray(buttons, item.id, p) })

    editPanel = (
      <div className="space-y-3">
        <PanelRow label="Label">
          <input
            type="text"
            value={item.label}
            placeholder="Teks tombol"
            onChange={(e) => patchButton({ label: e.target.value })}
            className="h-7 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-800 outline-none focus:border-indigo-300"
          />
        </PanelRow>
        <PanelSlider
          label="Lebar"
          value={item.wPct}
          min={5}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => patchButton({ wPct: v })}
        />
        <PanelSlider
          label="Tinggi"
          value={item.hPx}
          min={MIN_BUTTON_HEIGHT}
          max={MAX_BUTTON_HEIGHT}
          step={1}
          suffix="px"
          onChange={(v) => patchButton({ hPx: v })}
        />
        <PanelSlider
          label="Rounded"
          value={
            item.radius ??
            (item.shape === "square"
              ? 0
              : item.shape === "pill"
                ? Math.round(item.hPx / 2)
                : 47)
          }
          min={0}
          max={100}
          step={1}
          suffix="px"
          onChange={(v) => patchButton({ radius: v })}
        />
        <div className="border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => {
              patch({ buttons: deleteButtonFromArray(buttons, item.id) })
              onDeselect()
            }}
            className="inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 text-[11px] font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus tombol
          </button>
        </div>
      </div>
    )

    hasColor = true
  } else if (element.kind === "button") {
    // ── Hero CTA button (settings block hero-cta legacy) ───────────────────────
    const label = typeof settings?.label === "string" ? settings.label : ""
    const wPct = num(settings?.wPct, 24)
    const hPx = num(settings?.hPx, 56)

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
        <PanelSlider
          label="Rounded"
          value={num(
            settings?.ctaRadius,
            settings?.ctaVariant === "outline" ? Math.round(hPx / 2) : 47,
          )}
          min={0}
          max={100}
          step={1}
          suffix="px"
          onChange={(v) => patch({ ctaRadius: v })}
        />
      </div>
    )

    hasColor = true
  }

  return (
    <CanvasFloatingToolbar
      element={element}
      onPosition={onPosition}
      onColor={onColor}
      onDeselect={() => {
        onCroppingKeyChange(null)
        onDeselect()
      }}
      editPanel={editPanel}
      hasColor={hasColor}
      onCopyStyle={onCopyStyle}
      mobile={mobile}
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
