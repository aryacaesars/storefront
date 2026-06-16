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

const DEFAULT_CATEGORY_BLOCKS = [
  { slug: "tablets", label: "Fill It With NEO", cardBgColor: "#ffc300" },
  { slug: "speakers", label: "Great Experience", cardBgColor: "#007be0" },
  { slug: "earphones", label: "Sound Directly In Your EAR!", cardBgColor: "#ff4040" },
  {
    slug: "gaming",
    label: "Play With Your Friends",
    cardBgColor: "#d0cbcb",
  },
] as const

export const DEFAULT_BENTO_HOME: PageTemplate = {
  order: ["hero", "category-grid", "product-grid", "call-to-action"],
  sections: {
    hero: {
      type: "hero",
      blocks: [
        {
          id: "bento-hero-media",
          type: "hero-media",
          settings: {
            imageUrl: "",
            imgScale: 45,
            imgX: 0,
            imgY: 0,
            title1Layer: "front",
            title2Layer: "front",
            ...DEFAULT_HERO_TITLE_LAYOUTS,
          },
        },
        {
          id: "bento-hero-cta",
          type: "hero-cta",
          settings: {
            label: "Get Yours Now!",
            xPct: 70,
            wPct: 24,
            yPx: 459,
            hPx: 56,
            ctaBgColor: "#ffffff",
            ctaTextColor: "",
          },
        },
      ],
    },
    "category-grid": {
      type: "category-grid",
      blocks: DEFAULT_CATEGORY_BLOCKS.map((cat, index) => ({
        id: `bento-cat-${index}`,
        type: "category-card",
        settings: {
          label: cat.label,
          slug: cat.slug,
          cardBgColor: cat.cardBgColor,
          imageUrl: "",
          ...DEFAULT_IMAGE_TRANSFORM,
          ...DEFAULT_CARD_LAYOUTS[index],
          labelLayer: "front",
          labelScale: 100,
        },
      })),
    },
    "product-grid": { type: "product-grid" },
    "call-to-action": {
      type: "call-to-action",
      blocks: [
        {
          id: "bento-cta-image",
          type: "cta-image",
          settings: { imageUrl: "", ...DEFAULT_IMAGE_TRANSFORM },
        },
      ],
    },
  },
}
