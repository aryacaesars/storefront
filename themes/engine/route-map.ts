import type { PageType } from "./resolve-page"

/** Canonical storefront path → page type. */
export const HREF_TO_PAGE_TYPE: Record<string, PageType> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/shop": "shop",
  "/collections": "collections",
  "/products": "productList",
  "/new-arrivals": "newArrivals",
  "/tech-series": "techSeries",
  "/all-products": "allProducts",
  "/cart": "cart",
  "/checkout": "checkout",
  "/account": "account",
}

/** Page type → canonical path (for nav generation). */
export const PAGE_TYPE_TO_HREF: Partial<Record<PageType, string>> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  shop: "/shop",
  collections: "/collections",
  productList: "/products",
  newArrivals: "/new-arrivals",
  techSeries: "/tech-series",
  allProducts: "/all-products",
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
}

export function hrefToPageType(href: string): PageType | null {
  const path = href.split("?")[0].split("#")[0]
  return HREF_TO_PAGE_TYPE[path] ?? null
}
