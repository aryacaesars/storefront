import type { ReactNode } from "react"
import { headers } from "next/headers"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { ThemeChrome } from "@/themes/engine/ThemeChrome"
import type { ChromeMode } from "@/themes/engine/ThemeChromeView"
import { ThemeFontScope } from "@/themes/engine/ThemeFontScope"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"

interface StorefrontShellProps {
  children: ReactNode
  /** Home page membawa chrome sendiri via ThemeHomeView. */
  fullPage?: boolean
}

function resolveChromeMode(pathname: string | null): ChromeMode {
  if (!pathname) return "default"
  // Hanya halaman checkout form — success pakai chrome biasa / tetap checkout-style minimal
  if (pathname === "/checkout") return "checkout"
  return "default"
}

export async function StorefrontShell({
  children,
  fullPage = false,
}: StorefrontShellProps) {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  const pathname = (await headers()).get("x-pathname")
  const chromeMode = resolveChromeMode(pathname)

  return (
    <ThemeFontScope templateId={config.templateId}>
      <ThemeProvider config={config}>
        {fullPage ? (
          children
        ) : (
          <ThemeChrome config={config} mode={chromeMode}>
            {children}
          </ThemeChrome>
        )}
      </ThemeProvider>
    </ThemeFontScope>
  )
}
