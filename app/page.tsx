import { getAppContext, getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import BuilderLandingPage from "@/features/builder/landing/BuilderLandingPage"
import { StorefrontShell } from "@/features/storefront/StorefrontShell"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { HomePage } from "@/themes/minimalist/pages/HomePage"

export default async function Home() {
  const context = await getAppContext()

  if (context === "storefront") {
    const tenantSlug = await getTenantSubdomain()
    const config = await getStorefrontThemeConfig(tenantSlug)

    return (
      <StorefrontShell>
        <HomePage config={config} />
      </StorefrontShell>
    )
  }

  return <BuilderLandingPage />
}
