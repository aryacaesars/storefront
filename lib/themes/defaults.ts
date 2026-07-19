import type { TemplateId, ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_MINIMALIST_CONFIG } from "@/themes/minimalist/theme.config"
import { DEFAULT_BENTO_CONFIG } from "@/themes/bento/theme.config"

const DEFAULT_BOLD_CONFIG: ThemeConfig = {
  templateId: "bold",
  storeName: "BOLD STORE",
  tagline: "No limits. More motion.",
  primaryColor: "#0099E5",
  accentColor: "#00B4FF",
  headingFont: "var(--font-barlow)",
  bodyFont: "var(--font-geist-sans)",
  bannerText: "Free shipping on orders over Rp 500.000",
  hero: {
    title: "NO LIMITS.",
    subtitle: "MORE MOTION",
    ctaLabel: "SHOP NOW",
    ctaHref: "/products",
    align: "left",
    textTone: "light",
    titleSize: "lg",
  },
}

const DEFAULT_FASHION_CONFIG: ThemeConfig = {
  templateId: "fashion",
  storeName: "Fashion Edit",
  tagline: "Editorial style for modern lifestyle brands.",
  primaryColor: "#B45309",
  accentColor: "#FEF3C7",
  headingFont: "var(--font-playfair)",
  bodyFont: "var(--font-geist-sans)",
  bannerText: "New season collection — shop now",
}

export const DEFAULT_THEME_CONFIGS: Record<TemplateId, ThemeConfig> = {
  minimalist: DEFAULT_MINIMALIST_CONFIG,
  bold: DEFAULT_BOLD_CONFIG,
  fashion: DEFAULT_FASHION_CONFIG,
  bento: DEFAULT_BENTO_CONFIG,
}

export function getDefaultThemeConfig(templateId: TemplateId): ThemeConfig {
  return DEFAULT_THEME_CONFIGS[templateId]
}
