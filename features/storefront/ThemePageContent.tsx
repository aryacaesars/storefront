import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { PAGE_LABELS } from "@/themes/engine/manifest"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import type { PageType } from "@/themes/engine/resolve-page"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import {
  getCatalogProductBySlug,
  getCatalogProductsForTenant,
} from "@/features/storefront/catalog"
import { getStoreBySlug } from "@/server/services/tenant.service"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { getCustomerDefaultAddress } from "@/server/services/customer.service"
import type { CartItem } from "@/lib/storefront/cart"
import type { ThemePageProps } from "@/themes/engine/page-props"

interface ThemePageContentProps {
  pageType: PageType
  fallbackTitle: string
  slug?: string
}

export async function ThemePageContent({
  pageType,
  fallbackTitle,
  slug,
}: ThemePageContentProps): Promise<ReactNode> {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  const PageComponent = resolveThemePage(config.templateId, pageType)

  let products: Awaited<ReturnType<typeof getCatalogProductsForTenant>> = []
  let product: Awaited<ReturnType<typeof getCatalogProductBySlug>> = null
  let cart: CartItem[] = []
  let storeId: string | undefined
  let checkoutPrefill: ThemePageProps["checkoutPrefill"] = null

  if (pageType === "productList" || pageType === "allProducts" || pageType === "shop" || pageType === "newArrivals") {
    products = await getCatalogProductsForTenant(tenantSlug)
  }
  if (pageType === "productDetail" && slug) {
    const [detail, catalog] = await Promise.all([
      getCatalogProductBySlug(tenantSlug, slug),
      getCatalogProductsForTenant(tenantSlug),
    ])
    product = detail
    products = catalog
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
        checkoutPrefill = {
          name: customer.name ?? "",
          email: customer.email,
          phone: "",
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
      cart={cart}
      storeId={storeId}
      checkoutPrefill={checkoutPrefill}
    />
  )
}
