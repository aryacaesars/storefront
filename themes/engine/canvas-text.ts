/**
 * Free-text layer untuk canvas builder — analog `canvas-image.ts`. Item
 * disimpan di settings media block (key `texts`), dirender sebagai box teks
 * yang bisa digeser/di-resize di dalam frame section.
 */

export type CanvasTextItem = {
  id: string
  value: string
  /** Left edge as % of frame width */
  x: number
  /** Top edge as % of frame height */
  y: number
  /** Box width as % of frame width */
  width: number
  /** Font size dalam design px (di-render diskalakan terhadap lebar frame). */
  fontSize: number
  color?: string
  fontFamily?: string
  fontWeight?: number
  fontStyle?: "normal" | "italic"
  /** em */
  letterSpacing?: number
  lineHeight?: number
  textDecoration?: "underline" | "none"
  textTransform?: "uppercase" | "capitalize" | "none"
  /** 0–100 */
  opacity?: number
}

export const DEFAULT_CANVAS_TEXT_ITEM: Omit<CanvasTextItem, "id"> = {
  value: "Teks baru",
  x: 10,
  y: 10,
  width: 40,
  fontSize: 48,
}

function num(value: unknown, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function optNum(value: unknown): number | undefined {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function optStr(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined
}

function normalizeCanvasText(raw: Record<string, unknown>): CanvasTextItem {
  return {
    id: raw.id as string,
    value: typeof raw.value === "string" ? raw.value : "",
    x: num(raw.x, DEFAULT_CANVAS_TEXT_ITEM.x),
    y: num(raw.y, DEFAULT_CANVAS_TEXT_ITEM.y),
    width: num(raw.width, DEFAULT_CANVAS_TEXT_ITEM.width),
    fontSize: num(raw.fontSize, DEFAULT_CANVAS_TEXT_ITEM.fontSize),
    color: optStr(raw.color),
    fontFamily: optStr(raw.fontFamily),
    fontWeight: optNum(raw.fontWeight),
    fontStyle: raw.fontStyle === "italic" ? "italic" : undefined,
    letterSpacing: optNum(raw.letterSpacing),
    lineHeight: optNum(raw.lineHeight),
    textDecoration:
      raw.textDecoration === "underline" || raw.textDecoration === "none"
        ? raw.textDecoration
        : undefined,
    textTransform:
      raw.textTransform === "uppercase" ||
      raw.textTransform === "capitalize" ||
      raw.textTransform === "none"
        ? raw.textTransform
        : undefined,
    opacity: optNum(raw.opacity),
  }
}

export function parseCanvasTexts(
  settings: Record<string, unknown> | undefined,
): CanvasTextItem[] {
  const raw = settings?.texts
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === "string",
    )
    .map(normalizeCanvasText)
}

export function addTextToArray(
  items: CanvasTextItem[],
  value?: string,
): CanvasTextItem[] {
  const offset = items.length * 4
  return [
    ...items,
    {
      ...DEFAULT_CANVAS_TEXT_ITEM,
      id: `text-${Date.now()}`,
      ...(value ? { value } : {}),
      x: DEFAULT_CANVAS_TEXT_ITEM.x + offset,
      y: DEFAULT_CANVAS_TEXT_ITEM.y + offset,
    },
  ]
}

export function updateTextInArray(
  items: CanvasTextItem[],
  id: string,
  patch: Partial<CanvasTextItem>,
): CanvasTextItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

export function deleteTextFromArray(
  items: CanvasTextItem[],
  id: string,
): CanvasTextItem[] {
  return items.filter((item) => item.id !== id)
}

/**
 * Payload copy-style — key tanpa prefix ala HERO_TITLE_STYLE_KEYS supaya
 * clipboard style bisa dipakai lintas title line ↔ teks bebas.
 */
export function textItemToStylePayload(
  item: CanvasTextItem,
): Record<string, unknown> | null {
  const out: Record<string, unknown> = {}
  if (item.color) out.Color = item.color
  if (item.fontFamily) out.FontFamily = item.fontFamily
  if (item.fontWeight !== undefined) out.FontWeight = item.fontWeight
  if (item.fontStyle) out.FontStyle = item.fontStyle
  if (item.letterSpacing !== undefined) out.LetterSpacing = item.letterSpacing
  if (item.lineHeight !== undefined) out.LineHeight = item.lineHeight
  if (item.textDecoration) out.TextDecoration = item.textDecoration
  if (item.textTransform) out.TextTransform = item.textTransform
  if (item.opacity !== undefined) out.Opacity = item.opacity
  return Object.keys(out).length > 0 ? out : null
}

export function stylePayloadToTextPatch(
  style: Record<string, unknown>,
): Partial<CanvasTextItem> {
  const patch: Partial<CanvasTextItem> = {}
  if (typeof style.Color === "string" && style.Color) patch.color = style.Color
  if (typeof style.FontFamily === "string" && style.FontFamily) {
    patch.fontFamily = style.FontFamily
  }
  const weight = Number(style.FontWeight)
  if (Number.isFinite(weight)) patch.fontWeight = weight
  if (style.FontStyle === "italic" || style.FontStyle === "normal") {
    patch.fontStyle = style.FontStyle
  }
  const spacing = Number(style.LetterSpacing)
  if (Number.isFinite(spacing)) patch.letterSpacing = spacing
  const lineHeight = Number(style.LineHeight)
  if (Number.isFinite(lineHeight)) patch.lineHeight = lineHeight
  if (style.TextDecoration === "underline" || style.TextDecoration === "none") {
    patch.textDecoration = style.TextDecoration
  }
  if (
    style.TextTransform === "uppercase" ||
    style.TextTransform === "capitalize" ||
    style.TextTransform === "none"
  ) {
    patch.textTransform = style.TextTransform
  }
  const opacity = Number(style.Opacity)
  if (Number.isFinite(opacity)) patch.opacity = opacity
  return patch
}
