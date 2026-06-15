import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Header } from "@/themes/minimalist/sections/Header"
import { Footer } from "@/themes/minimalist/sections/Footer"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"

interface StorefrontShellProps {
  children: ReactNode
}

export async function StorefrontShell({ children }: StorefrontShellProps) {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)

  return (
    <ThemeProvider config={config}>
      <Header config={config} />
      {children}
      <Footer config={config} />
    </ThemeProvider>
  )
}
