import type { PageTemplate } from "@/themes/engine/schema"

export const DEFAULT_MINIMALIST_HOME: PageTemplate = {
  order: ["hero", "category-grid", "product-grid", "call-to-action"],
  sections: {
    hero: { type: "hero" },
    "category-grid": { type: "category-grid" },
    "product-grid": { type: "product-grid" },
    "call-to-action": { type: "call-to-action" },
  },
}
