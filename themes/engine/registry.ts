import { AboutPage as BoldAboutPage } from "@/themes/bold/pages/AboutPage"
import { ProductListPage as BoldProductListPage } from "@/themes/bold/pages/ProductListPage"
import { ProductDetailPage as BoldProductDetailPage } from "@/themes/bold/pages/ProductDetailPage"
import { CollectionPage as BoldCollectionPage } from "@/themes/bold/pages/CollectionPage"
import { CartPage as BoldCartPage } from "@/themes/bold/pages/CartPage"
import { CheckoutPage as BoldCheckoutPage } from "@/themes/bold/pages/CheckoutPage"
import { TechSeriesPage as BoldTechSeriesPage } from "@/themes/bold/pages/TechSeriesPage"
import { NewArrivalsPage as BoldNewArrivalsPage } from "@/themes/bold/pages/NewArrivalsPage"
import { AllProductsStorePage } from "@/themes/bold/pages/AllProductsStorePage"
import { AboutPage as FashionAboutPage } from "@/themes/fashion/pages/AboutPage"
import { ContactPage as FashionContactPage } from "@/themes/fashion/pages/ContactPage"
import { ShopAllPage as FashionShopPage } from "@/themes/fashion/pages/ShopAllPage"
import { CollectionsPage as FashionCollectionsPage } from "@/themes/fashion/pages/CollectionsPage"
import { ProductDetailPage as FashionProductDetailPage } from "@/themes/fashion/pages/ProductDetailPage"
import { CollectionPage as FashionCollectionPage } from "@/themes/fashion/pages/CollectionPage"
import { CartPage as FashionCartPage } from "@/themes/fashion/pages/CartPage"
import { CheckoutPage as FashionCheckoutPage } from "@/themes/fashion/pages/CheckoutPage"
import type { PageType } from "./resolve-page"

import type { TemplateId } from "./schema"
import { HomePage } from "@/themes/minimalist/pages/HomePage"
import { AboutPage as MinimalistAboutPage } from "@/themes/minimalist/pages/AboutPage"
import { ProductListPage as MinimalistProductListPage } from "@/themes/minimalist/pages/ProductListPage"
import { ProductDetailPage as MinimalistProductDetailPage } from "@/themes/minimalist/pages/ProductDetailPage"
import { CollectionPage as MinimalistCollectionPage } from "@/themes/minimalist/pages/CollectionPage"
import { CartPage as MinimalistCartPage } from "@/themes/minimalist/pages/CartPage"
import { CheckoutPage as MinimalistCheckoutPage } from "@/themes/minimalist/pages/CheckoutPage"
import { HomePage as BoldHomePage } from "@/themes/bold/pages/HomePage"
import { HomePage as FashionHomePage } from "@/themes/fashion/pages/HomePage"
import { HomePage as BentoHomePage } from "@/themes/bento/pages/HomePage"
import { AboutPage as BentoAboutPage } from "@/themes/bento/pages/AboutPage"
import { ProductListPage as BentoProductListPage } from "@/themes/bento/pages/ProductListPage"
import { ProductDetailPage as BentoProductDetailPage } from "@/themes/bento/pages/ProductDetailPage"
import { CollectionPage as BentoCollectionPage } from "@/themes/bento/pages/CollectionPage"
import { CartPage as BentoCartPage } from "@/themes/bento/pages/CartPage"
import { CheckoutPage as BentoCheckoutPage } from "@/themes/bento/pages/CheckoutPage"

export const TEMPLATE_IDS = ["minimalist", "bold", "fashion", "bento"] as const satisfies readonly TemplateId[]

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
  bento: {
    name: "Bento",
    description: "Bold product-first layout with oversized typography and gradient cards.",
  },
}

/** Page renderers keyed by templateId → pageType. */
export const templatePages = {
  minimalist: {
    home: HomePage,
    about: MinimalistAboutPage,
    productList: MinimalistProductListPage,
    productDetail: MinimalistProductDetailPage,
    collection: MinimalistCollectionPage,
    cart: MinimalistCartPage,
    checkout: MinimalistCheckoutPage,
  },
  bold: {
    home: BoldHomePage,
    about: BoldAboutPage,
    productList: BoldProductListPage,
    productDetail: BoldProductDetailPage,
    collection: BoldCollectionPage,
    cart: BoldCartPage,
    checkout: BoldCheckoutPage,
    techSeries: BoldTechSeriesPage,
    newArrivals: BoldNewArrivalsPage,
    allProducts: AllProductsStorePage,
  },
  fashion: {
    home: FashionHomePage,
    about: FashionAboutPage,
    contact: FashionContactPage,
    productList: FashionShopPage,
    productDetail: FashionProductDetailPage,
    collection: FashionCollectionPage,
    cart: FashionCartPage,
    checkout: FashionCheckoutPage,
    shop: FashionShopPage,
    collections: FashionCollectionsPage,
  },
  bento: {
    home: BentoHomePage,
    about: BentoAboutPage,
    productList: BentoProductListPage,
    productDetail: BentoProductDetailPage,
    collection: BentoCollectionPage,
    cart: BentoCartPage,
    checkout: BentoCheckoutPage,
  },
}

export function isTemplateRegistered(templateId: TemplateId): boolean {
  return templateId in templatePages
}

/** Page types with a registered component — used by editor picker & preview. */
export function getImplementedPages(templateId: TemplateId): PageType[] {
  const pages = templatePages[templateId] as Record<string, unknown> | undefined
  if (!pages) return []
  return Object.keys(pages) as PageType[]
}
