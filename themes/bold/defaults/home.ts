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
    hero: { type: "hero" },
    origin: { type: "origin" },
    manifesto: { type: "manifesto" },
    pillars: { type: "pillars" },
    impact: { type: "impact" },
    architects: { type: "architects" },
    "call-to-action": { type: "call-to-action" },
  },
}
