import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStorefrontThemeConfig } from "@/features/storefront/theme-config"
import {
  buildInitialsFaviconSvg,
  shouldUseLogoFavicon,
} from "@/features/storefront/store-favicon"

export const runtime = "nodejs"

function resolveLogoUrl(logoUrl: string, request: NextRequest): string | null {
  try {
    return new URL(logoUrl, request.nextUrl.origin).toString()
  } catch {
    return null
  }
}

/**
 * Favicon dinamis per tenant storefront.
 * - Ada logo gambar → fetch & return bytes (browser sering ignore redirect favicon)
 * - Selain itu → SVG inisial nama toko + primary color
 */
export async function GET(request: NextRequest) {
  const tenantSlug = await getTenantSubdomain()
  const config = await getStorefrontThemeConfig(tenantSlug)

  if (shouldUseLogoFavicon(config) && config.logoUrl) {
    const target = resolveLogoUrl(config.logoUrl, request)
    if (target) {
      try {
        const upstream = await fetch(target, {
          // Cache singkat supaya ganti logo cepat kelihatan
          next: { revalidate: 60 },
        })
        if (upstream.ok) {
          const contentType = upstream.headers.get("content-type") ?? "image/png"
          const body = await upstream.arrayBuffer()
          return new NextResponse(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
            },
          })
        }
      } catch {
        // fall through ke initials
      }
    }
  }

  const svg = buildInitialsFaviconSvg(config.storeName, config.primaryColor)

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
    },
  })
}
