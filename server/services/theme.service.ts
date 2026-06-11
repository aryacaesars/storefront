import "server-only"
import { themeConfigSchema, type ThemeConfig } from "@/themes/engine/schema"
import { DEFAULT_MINIMALIST_CONFIG } from "@/themes/minimalist/theme.config"

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

/**
 * Load published theme config for a tenant.
 * MVP: returns minimalist defaults; swap for Prisma lookup later.
 */
export async function getThemeConfig(
  tenantSlug: string | null,
): Promise<ThemeConfig> {
  const base = {
    ...DEFAULT_MINIMALIST_CONFIG,
    ...(tenantSlug ? { storeName: titleCase(tenantSlug) } : {}),
  }

  return themeConfigSchema.parse(base)
}
