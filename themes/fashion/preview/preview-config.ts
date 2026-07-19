import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`

/**
 * Config khusus dev preview (/preview/fashion): default theme + foto mock pada
 * blok hero/category. Hanya `imageUrl` yang dioverride — sisanya tetap
 * defaults via merge `resolvePageTemplate`. Tidak dipakai builder/storefront.
 */
export const FASHION_PREVIEW_CONFIG: ThemeConfig = {
  ...DEFAULT_FASHION_CONFIG,
  templates: {
    home: {
      order: [],
      sections: {
        hero: {
          type: "hero",
          blocks: [
            {
              id: "fashion-hero-media",
              type: "hero-media",
              settings: { imageUrl: img("photo-1469334031218-e382a71b716b", 1600) },
            },
          ],
        },
        "category-cards": {
          type: "category-cards",
          blocks: [
            {
              id: "fashion-cat-0",
              type: "category-card",
              settings: { imageUrl: img("photo-1445205170230-053b83016050", 800) },
            },
            {
              id: "fashion-cat-1",
              type: "category-card",
              settings: { imageUrl: img("photo-1483985988355-763728e1935b", 800) },
            },
            {
              id: "fashion-cat-2",
              type: "category-card",
              settings: { imageUrl: img("photo-1515562141207-7a88fb7ce338", 800) },
            },
          ],
        },
      },
    },
  },
}
