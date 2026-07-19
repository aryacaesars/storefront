import { getAppContext, getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import BuilderLandingPage from "@/features/builder/landing/BuilderLandingPage"
import { getTrendingCatalogProductsForTenant } from "@/features/storefront/catalog"
import { StorefrontShell } from "@/features/storefront/StorefrontShell"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { ThemeHomeView } from "@/themes/engine/ThemeHomeView"

export default async function Home() {
  const context = await getAppContext()

  if (context === "storefront") {
    const tenantSlug = await getTenantSubdomain()
    const [config, products] = await Promise.all([
      getStorefrontThemeConfig(tenantSlug),
      getTrendingCatalogProductsForTenant(tenantSlug, 8),
    ])

    return (
      <StorefrontShell fullPage>
        <ThemeHomeView config={config} products={products} />
      </StorefrontShell>
    )
  }

  return <BuilderLandingPage />
}
