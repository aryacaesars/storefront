import type { PageTemplate } from "@/themes/engine/schema"

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
          settings: { imageUrl: "", imgScale: 100, imgX: 0, imgY: 0 },
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
