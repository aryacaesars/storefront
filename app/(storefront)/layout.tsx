import type { ReactNode } from "react"
import type { Metadata } from "next"
import { StorefrontShell } from "@/features/storefront/StorefrontShell"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import { storefrontIconMetadata } from "@/features/storefront/store-favicon"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"

export async function generateMetadata(): Promise<Metadata> {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)
  return {
    title: {
      template: `%s — ${config.storeName}`,
      default: config.storeName,
    },
    description: config.tagline,
    icons: storefrontIconMetadata(config),
  }
}

export default async function StorefrontLayout({
  children,
}: {
  children: ReactNode
}) {
  return <StorefrontShell>{children}</StorefrontShell>
}
