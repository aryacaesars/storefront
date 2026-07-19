import "server-only"

import { cache } from "react"
import type { ThemeConfig } from "@/themes/engine/schema"
import { getDefaultThemeConfig } from "@/lib/themes/defaults"
import { getPublishedThemeBySlug } from "@/server/services/theme.service"

export function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/**
 * Published branding for public storefront (by tenant subdomain slug).
 * `cache` memoizes per render pass — shell + page bisa sama-sama memanggil
 * tanpa query DB dobel.
 */
export const getStorefrontThemeConfig = cache(
  async (tenantSlug: string | null): Promise<ThemeConfig> => {
    if (tenantSlug) {
      const published = await getPublishedThemeBySlug(tenantSlug)
      if (published) return published
    }

    const base = getDefaultThemeConfig("minimalist")
    if (!tenantSlug) return base

    const storeName = titleFromSlug(tenantSlug)

    return {
      ...base,
      templateId: "minimalist",
      storeName,
      tagline: `Welcome to ${storeName}.`,
    }
  },
)
