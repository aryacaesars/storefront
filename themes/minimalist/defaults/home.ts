import type { PageTemplate } from "@/themes/engine/schema"
import { DEFAULT_IMAGE_TRANSFORM } from "@/themes/bento/sections/category-grid-layout"

const DEFAULT_CATEGORY_BLOCKS = [
  { slug: "ready-to-wear", label: "Ready to Wear", cardBgColor: "#a8a29e" },
  { slug: "accessories", label: "Accessories", cardBgColor: "#78716c" },
  { slug: "footwear", label: "Footwear", cardBgColor: "#d6d3d1" },
  { slug: "outerwear", label: "Outerwear", cardBgColor: "#57534e" },
] as const

export const DEFAULT_MINIMALIST_HOME: PageTemplate = {
  order: ["hero", "category-grid", "product-grid", "call-to-action"],
  sections: {
    hero: {
      type: "hero",
      blocks: [
        {
          id: "minimalist-hero-media",
          type: "hero-media",
          settings: {
            imageUrl: "",
            imgScale: 100,
            imgX: 0,
            imgY: 0,
          },
        },
        {
          id: "minimalist-hero-cta",
          type: "hero-cta",
          settings: {
            label: "Shop Collection",
            ctaBgColor: "",
            ctaTextColor: "#ffffff",
          },
        },
      ],
    },
    "category-grid": {
      type: "category-grid",
      blocks: DEFAULT_CATEGORY_BLOCKS.map((cat, index) => ({
        id: `minimalist-cat-${index}`,
        type: "category-card",
        settings: {
          label: cat.label,
          slug: cat.slug,
          cardBgColor: cat.cardBgColor,
          imageUrl: "",
          ...DEFAULT_IMAGE_TRANSFORM,
        },
      })),
    },
    "product-grid": { type: "product-grid" },
    "call-to-action": {
      type: "call-to-action",
      blocks: [
        {
          id: "minimalist-cta-image",
          type: "cta-image",
          settings: { imageUrl: "", ...DEFAULT_IMAGE_TRANSFORM },
        },
      ],
    },
  },
}
