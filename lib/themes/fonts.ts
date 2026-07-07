export const HEADING_FONT_OPTIONS = [
  "Inter",
  "Geist",
  "Playfair Display",
  "Lora",
  "DM Serif Display",
] as const

export const BODY_FONT_OPTIONS = [
  "Inter",
  "Geist",
  "Plus Jakarta Sans",
  "DM Sans",
] as const

const FONT_CSS_MAP: Record<string, string> = {
  Inter: "Inter, system-ui, sans-serif",
  Geist: "var(--font-geist-sans)",
  "Playfair Display": "var(--font-playfair)",
  Lora: "Lora, Georgia, serif",
  "DM Serif Display": '"DM Serif Display", Georgia, serif',
  "Plus Jakarta Sans": '"Plus Jakarta Sans", system-ui, sans-serif',
  "DM Sans": '"DM Sans", system-ui, sans-serif',
}

const CSS_TO_LABEL = Object.fromEntries(
  Object.entries(FONT_CSS_MAP).map(([label, css]) => [css, label]),
)

export function fontLabelToCss(label: string): string {
  return FONT_CSS_MAP[label] ?? label
}

export function fontCssToLabel(css: string): string {
  return CSS_TO_LABEL[css] ?? css
}
