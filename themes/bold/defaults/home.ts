import type { PageTemplate } from "@/themes/engine/schema"
import { heroTitleLayoutsToPatch } from "@/themes/bento/sections/hero-title-layout"

// Left-aligned display headings over sky negative space (reference mockup)
const DEFAULT_BOLD_HERO_TITLE_LAYOUTS = heroTitleLayoutsToPatch(
  { xPct: 5, yPct: 30, wPct: 55, hPct: 16 },
  { xPct: 5, yPct: 47, wPct: 55, hPct: 16 },
)

export const DEFAULT_BOLD_HOME: PageTemplate = {
  order: [
    "hero",
    "category-grid",
    "call-to-action",
  ],
  sections: {
    hero: {
      type: "hero",
      blocks: [
        {
          id: "bold-hero-media",
          type: "hero-media",
          settings: {
            imageUrl: "/themes/bold/hero-athlete.png",
            imgScale: 100,
            title1Layer: "front",
            title2Layer: "front",
            title2Color: "#00B4FF",
            ...DEFAULT_BOLD_HERO_TITLE_LAYOUTS,
          },
        },
        {
          id: "bold-hero-cta",
          type: "hero-cta",
          settings: {
            label: "SHOP NOW",
            xPct: 5,
            wPct: 22,
            yPx: 430,
            hPx: 48,
            ctaBgColor: "transparent",
            ctaTextColor: "#ffffff",
            ctaVariant: "outline",
          },
        },
      ],
    },
    "category-grid": {
      type: "category-grid",
      blocks: [
        {
          id: "bold-cat-1",
          type: "category-card",
          settings: {
            label: "Performance",
            slug: "performance",
            cardBgColor: "#18181b",
            imageUrl: "",
            imgScale: 100,
            imgX: 0,
            imgY: 0,
            xPct: 0,
            yPx: 0,
            wPct: 49,
            hPx: 430,
            labelLayer: "front",
            labelXPct: 5,
            labelYPct: 8,
            labelWPct: 90,
            labelHPct: 20,
          },
        },
        {
          id: "bold-cat-2",
          type: "category-card",
          settings: {
            label: "New Arrivals",
            slug: "new-arrivals",
            cardBgColor: "#27272a",
            imageUrl: "",
            imgScale: 100,
            imgX: 0,
            imgY: 0,
            xPct: 51,
            yPx: 0,
            wPct: 49,
            hPx: 210,
            labelLayer: "front",
            labelXPct: 5,
            labelYPct: 50,
            labelWPct: 90,
            labelHPct: 30,
          },
        },
        {
          id: "bold-cat-3",
          type: "category-card",
          settings: {
            label: "All Products",
            slug: "all-products",
            cardBgColor: "#3f3f46",
            imageUrl: "",
            imgScale: 100,
            imgX: 0,
            imgY: 0,
            xPct: 51,
            yPx: 220,
            wPct: 49,
            hPx: 210,
            labelLayer: "front",
            labelXPct: 5,
            labelYPct: 50,
            labelWPct: 90,
            labelHPct: 30,
          },
        },
      ],
    },
    "call-to-action": { type: "call-to-action" },
  },
}
