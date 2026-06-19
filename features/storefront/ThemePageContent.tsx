import type { ReactNode } from "react"
import { PAGE_LABELS } from "@/themes/engine/manifest"
import { resolveThemePage } from "@/themes/engine/resolve-page"
import type { PageType } from "@/themes/engine/resolve-page"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import {
  getCatalogProductBySlug,
  getCatalogProductsForTenant,
} from "@/features/storefront/catalog"

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

  if (pageType === "productList" || pageType === "allProducts" || pageType === "shop") {
    products = await getCatalogProductsForTenant(tenantSlug)
  }
  if (pageType === "productDetail" && slug) {
    product = await getCatalogProductBySlug(tenantSlug, slug)
    if (!product) {
      products = await getCatalogProductsForTenant(tenantSlug)
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
    />
  )
}
