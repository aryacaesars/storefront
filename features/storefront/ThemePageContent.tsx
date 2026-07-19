import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { PAGE_LABELS } from "@/themes/engine/manifest"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import type { PageType } from "@/themes/engine/resolve-page"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import {
  getCatalogCategoryBySlug,
  getCatalogProductBySlug,
  getCatalogProductsByCategorySlug,
  getCatalogProductsForTenant,
  getFilteredCatalogProductsForTenant,
  parseCatalogSearchParams,
} from "@/features/storefront/catalog"
import type { CatalogListFilters } from "@/features/storefront/catalog-types"
import { getStoreBySlug } from "@/server/services/tenant.service"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { getCustomerDefaultAddress } from "@/server/services/customer.service"
import type { CartItem } from "@/lib/storefront/cart"
import type { ThemePageProps } from "@/themes/engine/page-props"
import type { StorefrontCategory } from "@/features/storefront/catalog-types"

interface ThemePageContentProps {
  pageType: PageType
  fallbackTitle: string
  slug?: string
  searchParams?: Record<string, string | string[] | undefined>
}

const CATALOG_LIST_PAGES: PageType[] = [
  "productList",
  "allProducts",
  "shop",
  "newArrivals",
]

export async function ThemePageContent({
  pageType,
  fallbackTitle,
  slug,
  searchParams,
}: ThemePageContentProps): Promise<ReactNode> {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  const PageComponent = resolveThemePage(config.templateId, pageType)

  let products: Awaited<ReturnType<typeof getCatalogProductsForTenant>> = []
  let product: Awaited<ReturnType<typeof getCatalogProductBySlug>> = null
  let category: ThemePageProps["category"] = undefined
  let categories: StorefrontCategory[] = []
  let priceBounds: { min: number; max: number } | null = null
  let catalogFilters: CatalogListFilters = {}
  let cart: CartItem[] = []
  let storeId: string | undefined
  let checkoutPrefill: ThemePageProps["checkoutPrefill"] = null
  let checkoutCustomer: ThemePageProps["checkoutCustomer"] = null
  let checkoutAddress: ThemePageProps["checkoutAddress"] = null

  if (CATALOG_LIST_PAGES.includes(pageType)) {
    catalogFilters = parseCatalogSearchParams(searchParams)
    const filtered = await getFilteredCatalogProductsForTenant(
      tenantSlug,
      catalogFilters,
    )
    products = filtered.products
    categories = filtered.categories
    priceBounds = filtered.priceBounds
  }
  if (pageType === "productDetail" && slug) {
    const [detail, catalog] = await Promise.all([
      getCatalogProductBySlug(tenantSlug, slug),
      getCatalogProductsForTenant(tenantSlug),
    ])
    product = detail
    products = catalog
    // Live tenant + slug tidak ada → App Router not-found
    if (tenantSlug && !detail) notFound()
  }
  if (pageType === "collection" && slug && tenantSlug) {
    const [cat, catProducts] = await Promise.all([
      getCatalogCategoryBySlug(tenantSlug, slug),
      getCatalogProductsByCategorySlug(tenantSlug, slug),
    ])
    category = cat
    products = catProducts
  }
  if (pageType === "cart" || pageType === "checkout") {
    const cookieStore = await cookies()
    const raw = cookieStore.get("sf_cart")?.value
    if (raw) {
      try {
        cart = JSON.parse(raw) as CartItem[]
      } catch {
        cart = []
      }
    }
    if (tenantSlug) {
      const store = await getStoreBySlug(tenantSlug)
      storeId = store?.id
    }
    if (pageType === "checkout") {
      const customer = await getCustomerSession()
      if (customer) {
        const address = await getCustomerDefaultAddress(customer.customerId)
        checkoutCustomer = {
          name: customer.name ?? "",
          email: customer.email,
          phone: customer.phone ?? "",
        }
        checkoutAddress = address
          ? {
              id: address.id,
              label: address.label,
              street: address.street,
              city: address.city,
              province: address.province,
              postalCode: address.postalCode,
            }
          : null
        checkoutPrefill = {
          name: customer.name ?? "",
          email: customer.email,
          phone: customer.phone ?? "",
          street: address?.street ?? "",
          city: address?.city ?? "",
          province: address?.province ?? "",
          postalCode: address?.postalCode ?? "",
        }
      }
    }
  }

  if (!PageComponent) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1
          className="text-3xl font-semibold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {PAGE_LABELS[pageType] ?? fallbackTitle}
        </h1>
        <p className="mt-4 text-sm text-[var(--theme-muted)]">Coming soon.</p>
      </div>
    )
  }

  return (
    <PageComponent
      config={config}
      slug={slug}
      products={products}
      product={product}
      category={category}
      categories={categories}
      priceBounds={priceBounds}
      catalogFilters={catalogFilters}
      cart={cart}
      storeId={storeId}
      checkoutCustomer={checkoutCustomer}
      checkoutAddress={checkoutAddress}
      checkoutPrefill={checkoutPrefill}
    />
  )
}
