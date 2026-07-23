import type { PageTemplate } from "@/themes/engine/schema"
import { heroTitleLayoutsToPatch } from "@/themes/bento/sections/hero-title-layout"

const DEFAULT_FASHION_CATEGORIES = [
  { slug: "new-collection", label: "New Collection", cta: "SHOP NOW",  cardBgColor: "#d6d1c9" },
  { slug: "best-sellers",   label: "Best Sellers",   cta: "EXPLORE",   cardBgColor: "#c4b49e" },
  { slug: "jewelry",        label: "Jewelry",         cta: "DISCOVER",  cardBgColor: "#3f3f3f" },
] as const

const DEFAULT_IMG = { imageUrl: "", imgScale: 100, imgX: 0, imgY: 0 }

// Fashion: large italic Cormorant title near bottom-left, small tracking tagline below
const DEFAULT_FASHION_HERO_TITLE_LAYOUTS = heroTitleLayoutsToPatch(
  { xPct: 3.3, yPct: 48, wPct: 62, hPct: 22 },
  { xPct: 3.3, yPct: 73, wPct: 50, hPct: 7 },
)

export const DEFAULT_FASHION_HOME: PageTemplate = {
  order: [
    "hero",
    "category-cards",
    "signature-series",
    "brand-story",
    "community-gallery",
    "newsletter-cta",
    "footer",
  ],
  sections: {
    hero: {
      type: "hero",
      blocks: [
        {
          id: "fashion-hero-media",
          type: "hero-media",
          settings: {
            ...DEFAULT_IMG,
            title1Layer: "front",
            title2Layer: "front",
            ...DEFAULT_FASHION_HERO_TITLE_LAYOUTS,
          },
        },
        {
          id: "fashion-hero-cta",
          type: "hero-cta",
          settings: {
            label: "EXPLORE COLLECTION",
            xPct: 3.3,
            wPct: 26,
            yPx: 498,
            hPx: 40,
            ctaBgColor: "#6B5744",
            ctaTextColor: "#ffffff",
          },
        },
      ],
    },
    "category-cards": {
      type: "category-cards",
      blocks: DEFAULT_FASHION_CATEGORIES.map((cat, i) => ({
        id: `fashion-cat-${i}`,
        type: "category-card",
        settings: {
          label: cat.label,
          slug: cat.slug,
          cta: cat.cta,
          cardBgColor: cat.cardBgColor,
          ...DEFAULT_IMG,
        },
      })),
    },
    "signature-series": {
      type: "signature-series",
      blocks: [
        {
          id: "fashion-signature-eyebrow",
          type: "section-text",
          settings: { label: "", labelBasePx: 10 },
        },
        {
          id: "fashion-signature-title",
          type: "section-text",
          settings: { label: "", labelBasePx: 30 },
        },
      ],
    },
    "brand-story": {
      type: "brand-story",
      blocks: [
        {
          id: "fashion-story-eyebrow",
          type: "section-text",
          settings: { label: "", labelBasePx: 10 },
        },
        {
          id: "fashion-story-title",
          type: "section-text",
          settings: { label: "", labelBasePx: 30 },
        },
        {
          id: "fashion-story-body",
          type: "section-text",
          settings: { label: "", labelBasePx: 14 },
        },
        {
          id: "fashion-story-quote",
          type: "section-text",
          settings: { label: "", labelBasePx: 14 },
        },
      ],
    },
    "community-gallery": {
      type: "community-gallery",
      blocks: [
        {
          id: "fashion-community-eyebrow",
          type: "section-text",
          settings: { label: "", labelBasePx: 10 },
        },
        {
          id: "fashion-community-title",
          type: "section-text",
          settings: { label: "", labelBasePx: 30 },
        },
      ],
    },
    "newsletter-cta": {
      type: "newsletter-cta",
      blocks: [{ id: "fashion-cta-content", type: "cta-content", settings: {} }],
    },
    footer:              { type: "footer" },
  },
}
