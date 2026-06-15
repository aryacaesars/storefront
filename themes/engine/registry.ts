import type { TemplateId } from "./schema"
import { HomePage } from "@/themes/minimalist/pages/HomePage"
import { HomePage as BoldHomePage } from "@/themes/bold/pages/HomePage"
import { HomePage as FashionHomePage } from "@/themes/fashion/pages/HomePage"

export const TEMPLATE_IDS = ["minimalist", "bold", "fashion"] as const satisfies readonly TemplateId[]

export const TEMPLATE_META: Record<
  TemplateId,
  { name: string; description: string }
> = {
  minimalist: {
    name: "Aurora Minimal",
    description: "Quiet luxury with clean typography and generous whitespace.",
  },
  bold: {
    name: "Bold",
    description: "High contrast layouts with strong visual statements.",
  },
  fashion: {
    name: "Fashion",
    description: "Editorial grids built for lifestyle and apparel brands.",
  },
}

/** Page renderers keyed by template. Expand as routes are built. */
export const templatePages = {
  minimalist: {
    HomePage,
  },
  bold: {
    HomePage: BoldHomePage,
  },
  fashion: {
    HomePage: FashionHomePage,
  },
} as const
