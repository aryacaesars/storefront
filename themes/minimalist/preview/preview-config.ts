import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_MINIMALIST_CONFIG } from "@/themes/minimalist/theme.config"

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`

/**
 * Config khusus dev preview (/preview): default theme + foto mock pada blok
 * hero/category/CTA. Hanya `imageUrl` yang dioverride — sisanya tetap defaults
 * via merge `resolvePageTemplate`. Tidak dipakai builder/storefront.
 */
export const MINIMALIST_PREVIEW_CONFIG: ThemeConfig = {
  ...DEFAULT_MINIMALIST_CONFIG,
  templates: {
    home: {
      order: [],
      sections: {
        hero: {
          type: "hero",
          blocks: [
            {
              id: "minimalist-hero-media",
              type: "hero-media",
              settings: { imageUrl: img("photo-1441986300917-64674bd600d8") },
            },
          ],
        },
        "category-grid": {
          type: "category-grid",
          blocks: [
            {
              id: "minimalist-cat-0",
              type: "category-card",
              settings: { imageUrl: img("photo-1445205170230-053b83016050", 800) },
            },
            {
              id: "minimalist-cat-1",
              type: "category-card",
              settings: { imageUrl: img("photo-1515562141207-7a88fb7ce338", 800) },
            },
            {
              id: "minimalist-cat-2",
              type: "category-card",
              settings: { imageUrl: img("photo-1549298916-b41d501d3772", 800) },
            },
            {
              id: "minimalist-cat-3",
              type: "category-card",
              settings: { imageUrl: img("photo-1539533018447-63fcce2678e3", 800) },
            },
          ],
        },
        "call-to-action": {
          type: "call-to-action",
          blocks: [
            {
              id: "minimalist-cta-image",
              type: "cta-image",
              settings: { imageUrl: img("photo-1490481651871-ab68de25d43d", 800) },
            },
          ],
        },
      },
    },
  },
}
