import type { PageTemplate } from "@/themes/engine/schema"

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
    hero: { type: "hero" },
    "category-cards": { type: "category-cards" },
    "signature-series": { type: "signature-series" },
    "brand-story": { type: "brand-story" },
    "community-gallery": { type: "community-gallery" },
    "newsletter-cta": { type: "newsletter-cta" },
    footer: { type: "footer" },
  },
}
