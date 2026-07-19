import type { ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format`

/**
 * Config khusus dev preview (/preview/bold): default theme + foto mock pada
 * category cards. Hanya `imageUrl` yang dioverride — sisanya tetap defaults
 * via merge `resolvePageTemplate`. Tidak dipakai builder/storefront.
 */
export const BOLD_PREVIEW_CONFIG: ThemeConfig = {
  ...DEFAULT_BOLD_CONFIG,
  templates: {
    home: {
      order: [],
      sections: {
        "category-grid": {
          type: "category-grid",
          blocks: [
            {
              id: "bold-cat-1",
              type: "category-card",
              settings: { imageUrl: img("photo-1517836357463-d25dfeac3438") },
            },
            {
              id: "bold-cat-2",
              type: "category-card",
              settings: { imageUrl: img("photo-1552674605-db6ffd4facb5") },
            },
            {
              id: "bold-cat-3",
              type: "category-card",
              settings: { imageUrl: img("photo-1542291026-7eec264c27ff") },
            },
          ],
        },
      },
    },
  },
}
