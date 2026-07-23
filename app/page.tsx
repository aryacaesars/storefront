import type { Metadata } from "next"
import { getAppContext, getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import BuilderLandingPage from "@/features/builder/landing/BuilderLandingPage"
import { getTrendingCatalogProductsForTenant } from "@/features/storefront/catalog"
import { getCustomerSession } from "@/features/storefront/customer-dal"
import { StorefrontShell } from "@/features/storefront/StorefrontShell"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { storefrontIconMetadata } from "@/features/storefront/store-favicon"
import { ThemeHomeView } from "@/themes/engine/ThemeHomeView"

export async function generateMetadata(): Promise<Metadata> {
  const context = await getAppContext()
  if (context !== "storefront") return {}

  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  return {
    title: { absolute: config.storeName },
    description: config.tagline,
    icons: storefrontIconMetadata(config),
  }
}

export default async function Home() {
  const context = await getAppContext()

  if (context === "storefront") {
    const tenantSlug = await getTenantSubdomain()
    const [config, products, session] = await Promise.all([
      getStorefrontThemeConfig(tenantSlug),
      getTrendingCatalogProductsForTenant(tenantSlug, 8),
      getCustomerSession(),
    ])

    return (
      <StorefrontShell fullPage>
        <ThemeHomeView
          config={config}
          products={products}
          customerName={session ? (session.name ?? session.email) : null}
        />
      </StorefrontShell>
    )
  }

  return <BuilderLandingPage />
}
