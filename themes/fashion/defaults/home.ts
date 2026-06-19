import type { PageTemplate } from "@/themes/engine/schema"

const DEFAULT_FASHION_CATEGORIES = [
  { slug: "new-collection", label: "New Collection", cta: "SHOP NOW",  cardBgColor: "#d6d1c9" },
  { slug: "best-sellers",   label: "Best Sellers",   cta: "EXPLORE",   cardBgColor: "#c4b49e" },
  { slug: "jewelry",        label: "Jewelry",         cta: "DISCOVER",  cardBgColor: "#3f3f3f" },
] as const

const DEFAULT_IMG = { imageUrl: "", imgScale: 100, imgX: 0, imgY: 0 }

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
          settings: { ...DEFAULT_IMG },
        },
        {
          id: "fashion-hero-cta",
          type: "hero-cta",
          settings: { label: "EXPLORE COLLECTION", ctaBgColor: "", ctaTextColor: "#ffffff" },
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
    "signature-series":  { type: "signature-series" },
    "brand-story":       { type: "brand-story" },
    "community-gallery": { type: "community-gallery" },
    "newsletter-cta":    { type: "newsletter-cta" },
    footer:              { type: "footer" },
  },
}
