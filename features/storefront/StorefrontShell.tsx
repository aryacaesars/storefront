import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { ThemeChrome } from "@/themes/engine/ThemeChrome"
import { ThemeFontScope } from "@/themes/engine/ThemeFontScope"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"

interface StorefrontShellProps {
  children: ReactNode
  /** Home page membawa chrome sendiri via ThemeHomeView. */
  fullPage?: boolean
}

export async function StorefrontShell({
  children,
  fullPage = false,
}: StorefrontShellProps) {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)

  return (
    <ThemeFontScope templateId={config.templateId}>
      <ThemeProvider config={config}>
        {fullPage ? children : <ThemeChrome config={config}>{children}</ThemeChrome>}
      </ThemeProvider>
    </ThemeFontScope>
  )
}
