import type { Metadata } from "next"
import type { ThemeConfig } from "@/themes/engine/schema"

/** Pakai gambar logo sebagai favicon kalau ada URL dan mode-nya bukan text-only. */
export function shouldUseLogoFavicon(config: ThemeConfig): boolean {
  return Boolean(config.logoUrl) && config.logoDisplay !== "text"
}

/** Inisial dari nama toko: "Toko Arya" → "TA", "BentoStore" → "BE". */
export function storeInitials(storeName: string): string {
  const parts = storeName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase()
  }
  return parts[0]!.slice(0, 2).toUpperCase()
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

/** SVG favicon inisial — warna ikut primary toko. */
export function buildInitialsFaviconSvg(
  storeName: string,
  primaryColor: string,
): string {
  const initials = escapeXml(storeInitials(storeName))
  const fill = escapeXml(primaryColor || "#1a1a1a")
  const fontSize = initials.length > 1 ? 26 : 30

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${fill}"/>
  <text
    x="32"
    y="34"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#ffffff"
    font-family="system-ui, -apple-system, Segoe UI, sans-serif"
    font-size="${fontSize}"
    font-weight="700"
  >${initials}</text>
</svg>`
}

/**
 * Favicon metadata per tenant.
 * Logo URL dipasang langsung di <link> (lebih andal dari redirect),
 * plus fallback API untuk request /favicon.ico lewat proxy rewrite.
 */
export function storefrontIconMetadata(
  config: ThemeConfig,
): NonNullable<Metadata["icons"]> {
  if (shouldUseLogoFavicon(config) && config.logoUrl) {
    return {
      icon: [
        { url: config.logoUrl },
        { url: "/api/storefront/favicon" },
      ],
      shortcut: config.logoUrl,
      apple: [{ url: config.logoUrl }],
    }
  }

  return {
    icon: [{ url: "/api/storefront/favicon", type: "image/svg+xml" }],
    apple: [{ url: "/api/storefront/favicon" }],
  }
}
