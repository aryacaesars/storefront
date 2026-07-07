import type { ThemeConfig } from "@/themes/engine/schema"

export const DEFAULT_BOLD_CONFIG: ThemeConfig = {
  templateId: "bold",
  storeName: "BOLD STORE",
  tagline: "No limits. More motion.",
  primaryColor: "#0099E5",
  accentColor: "#00B4FF",
  headingFont: "var(--font-barlow)",
  bodyFont: "var(--font-geist-sans)",
  bannerText: "Free shipping on orders over $200 — Elite members get priority dispatch",
  heroImageUrl: "/themes/bold/hero-athlete.png",
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
