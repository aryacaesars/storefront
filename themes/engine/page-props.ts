import type { ThemeConfig } from "./schema"

/** Props passed to every theme page component from the storefront / builder. */
export type ThemePageProps = {
  config: ThemeConfig
  /** Route param for product detail, collection, order, etc. */
  slug?: string
}

/** Default slug used in builder preview for parametric pages. */
export const PREVIEW_PAGE_SLUGS: Partial<
  Record<"productDetail" | "collection" | "order", string>
> = {
  productDetail: "1",
  collection: "ready-to-wear",
  order: "1001",
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
