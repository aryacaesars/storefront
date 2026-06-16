export type PlatformPageType =
  | "home"
  | "productList"
  | "productDetail"
  | "collection"
  | "cart"
  | "checkout"
  | "order"
  | "account"

export type MarketingPageType =
  | "about"
  | "contact"
  | "collections"
  | "shop"
  | "techSeries"
  | "newArrivals"
  | "allProducts"

export type PageType = PlatformPageType | MarketingPageType

export type ThemeManifest = {
  templateId: string
  /** Platform routes the theme must eventually implement (Phase 5). */
  platform: PlatformPageType[]
  /** Marketing routes declared for this theme; wire each in templatePages registry. */
  marketing: MarketingPageType[]
}

/** Human-readable label for page types shown in the editor. */
export const PAGE_LABELS: Record<PageType, string> = {
  home: "Home",
  productList: "Products",
  productDetail: "Product Detail",
  collection: "Collection",
  cart: "Cart",
  checkout: "Checkout",
  order: "Order",
  account: "Account",
  about: "About",
  contact: "Contact",
  collections: "Collections",
  shop: "Shop All",
  techSeries: "Tech Series",
  newArrivals: "New Arrivals",
  allProducts: "All Products",
}
