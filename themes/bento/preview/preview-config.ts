import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_BENTO_CONFIG } from "@/themes/bento/theme.config"
import {
  defaultHeroTitle1Layout,
  defaultHeroTitle2Layout,
  heroTitleLayoutsToPatch,
} from "@/themes/bento/sections/hero-title-layout"

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`

/** ~1.4× default title size for preview hero. */
const PREVIEW_TITLE1 = {
  ...defaultHeroTitle1Layout(false),
  hPct: 19,
}
const PREVIEW_TITLE2 = {
  ...defaultHeroTitle2Layout(false, PREVIEW_TITLE1),
  hPct: 19,
}

/**
 * Config khusus dev preview (/preview/bento): default theme + foto mock pada
 * blok hero/category/CTA. Hanya override image/scale/title size — sisanya
 * defaults via merge `resolvePageTemplate`. Tidak dipakai builder/storefront.
 */
export const BENTO_PREVIEW_CONFIG: ThemeConfig = {
  ...DEFAULT_BENTO_CONFIG,
  templates: {
    home: {
      order: [],
      sections: {
        hero: {
          type: "hero",
          blocks: [
            {
              id: "bento-hero-media",
              type: "hero-media",
              settings: {
                imageUrl: "/themes/bento/image%2014.png",
                imgScale: 120,
                ...heroTitleLayoutsToPatch(PREVIEW_TITLE1, PREVIEW_TITLE2),
              },
            },
          ],
        },
        "category-grid": {
          type: "category-grid",
          blocks: [
            {
              id: "bento-cat-0",
              type: "category-card",
              settings: { imageUrl: img("photo-1544244015-0df4b3ffc6b0", 800) },
            },
            {
              id: "bento-cat-1",
              type: "category-card",
              settings: { imageUrl: img("photo-1545454675-3531b543be5d", 800) },
            },
            {
              id: "bento-cat-2",
              type: "category-card",
              settings: { imageUrl: img("photo-1505740420928-5e560c06d30e", 800) },
            },
            {
              id: "bento-cat-3",
              type: "category-card",
              settings: { imageUrl: img("photo-1552820728-8b83bb6b773f", 800) },
            },
          ],
        },
        "call-to-action": {
          type: "call-to-action",
          blocks: [
            {
              id: "bento-cta-image",
              type: "cta-image",
              settings: { imageUrl: img("photo-1484704849700-f032a568e944", 800) },
          },
          ],
        },
      },
    },
  },
}
