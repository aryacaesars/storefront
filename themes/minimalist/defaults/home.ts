import type { PageTemplate } from "@/themes/engine/schema"
import { DEFAULT_CARD_LAYOUTS, DEFAULT_IMAGE_TRANSFORM } from "@/themes/bento/sections/category-grid-layout"
import {
  defaultHeroTitle1Layout,
  defaultHeroTitle2Layout,
  heroTitleLayoutsToPatch,
} from "@/themes/bento/sections/hero-title-layout"

const DEFAULT_HERO_TITLE_LAYOUTS = heroTitleLayoutsToPatch(
  defaultHeroTitle1Layout(false),
  defaultHeroTitle2Layout(false),
)

const MINIMALIST_CARD_LABEL = { xPct: 6, yPct: 78, wPct: 82, hPct: 16 } as const

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
            title1Layer: "front",
            title2Layer: "front",
            ...DEFAULT_HERO_TITLE_LAYOUTS,
          },
        },
        {
          id: "minimalist-hero-cta",
          type: "hero-cta",
          settings: {
            label: "Shop Collection",
            xPct: 5,
            wPct: 22,
            yPx: 460,
            hPx: 44,
            ctaBgColor: "#3D4F6F",
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
          ...DEFAULT_CARD_LAYOUTS[index],
          labelLayer: "front",
          labelXPct: MINIMALIST_CARD_LABEL.xPct,
          labelYPct: MINIMALIST_CARD_LABEL.yPct,
          labelWPct: MINIMALIST_CARD_LABEL.wPct,
          labelHPct: MINIMALIST_CARD_LABEL.hPct,
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
