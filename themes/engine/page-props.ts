import type { ThemeConfig } from "./schema"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import type { StorefrontCategory } from "@/features/storefront/catalog-types"
import type { CatalogListFilters } from "@/features/storefront/catalog-types"
import type { CartItem } from "@/lib/storefront/cart"

/** Props passed to every theme page component from the storefront / builder. */
export type ThemePageProps = {
  config: ThemeConfig
  /** Route param for product detail, collection, order, etc. */
  slug?: string
  /** Live catalog products. */
  products?: CatalogProduct[]
  product?: CatalogProduct | null
  /**
   * Collection page category lookup.
   * - `undefined` — preview / no tenant catalog fetch
   * - `null` — tenant active but category slug not found
   * - object — category found in database
   */
  category?: StorefrontCategory | null
  /** Categories for product list filters. */
  categories?: StorefrontCategory[]
  /** Min/max price across published catalog (for filter UI). */
  priceBounds?: { min: number; max: number } | null
  /** Active catalog filters from URL search params. */
  catalogFilters?: CatalogListFilters
  /** Cart items (for cart and checkout pages). */
  cart?: CartItem[]
  /** Store ID (for checkout action binding). */
  storeId?: string
  /** Logged-in customer snapshot for checkout (profile from /account). */
  checkoutCustomer?: {
    name: string
    email: string
    phone: string
  } | null
  /** Default shipping address for checkout (managed on /account). */
  checkoutAddress?: {
    id: string
    label: string | null
    street: string
    city: string
    province: string
    postalCode: string
  } | null
  /**
   * @deprecated Prefer checkoutCustomer + checkoutAddress.
   * Kept temporarily for themes still reading checkoutPrefill.
   */
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
