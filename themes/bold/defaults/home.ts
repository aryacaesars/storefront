import type { PageTemplate } from "@/themes/engine/schema"
import { heroTitleLayoutsToPatch } from "@/themes/bento/sections/hero-title-layout"

// Bold: massive Barlow Condensed heading occupies upper half, compact subtitle below
const DEFAULT_BOLD_HERO_TITLE_LAYOUTS = heroTitleLayoutsToPatch(
  { xPct: 2, yPct: 28, wPct: 72, hPct: 32 },
  { xPct: 2, yPct: 63, wPct: 65, hPct: 9 },
)

export const DEFAULT_BOLD_HOME: PageTemplate = {
  order: [
    "hero",
    "origin",
    "manifesto",
    "pillars",
    "impact",
    "architects",
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
            imageUrl: "",
            imgScale: 100,
            imgX: 0,
            imgY: 0,
            title1Layer: "front",
            title2Layer: "front",
            ...DEFAULT_BOLD_HERO_TITLE_LAYOUTS,
          },
        },
      ],
    },
    origin: { type: "origin" },
    manifesto: { type: "manifesto" },
    pillars: { type: "pillars" },
    impact: { type: "impact" },
    architects: { type: "architects" },
    "call-to-action": { type: "call-to-action" },
  },
}
