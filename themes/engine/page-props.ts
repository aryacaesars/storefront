import type { ThemeConfig } from "./schema"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import type { CartItem } from "@/lib/storefront/cart"

/** Props passed to every theme page component from the storefront / builder. */
export type ThemePageProps = {
  config: ThemeConfig
  /** Route param for product detail, collection, order, etc. */
  slug?: string
  /** Live catalog products. */
  products?: CatalogProduct[]
  product?: CatalogProduct | null
  /** Cart items (for cart and checkout pages). */
  cart?: CartItem[]
  /** Store ID (for checkout action binding). */
  storeId?: string
  /** Checkout prefill from the logged-in customer + saved address. */
  checkoutPrefill?: {
    name: string
    email: string
    phone: string
    street: string
    city: string
    province: string
    postalCode: string
  } | null
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
