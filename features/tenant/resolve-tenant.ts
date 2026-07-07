import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

const CTX_HEADER = "x-app-context"
const TENANT_HEADER = "x-tenant-subdomain"

/**
 * Derive tenant slug langsung dari Host header. Dipakai sebagai fallback
 * kalau proxy header (x-tenant-subdomain) absen — kadang proxy tak jalan di
 * sebagian request (RSC prefetch / server action), bikin tenant null →
 * theme jatuh ke default minimalist. Logika harus cermin proxy.ts resolve().
 */
function tenantFromHost(host: string): string | null {
  const hostname = host.split(":")[0].toLowerCase()
  if (!hostname) return null

  // Dev: <sub>.localhost
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length)
    if (!sub || sub === "app" || sub === "www") return null
    return sub.split(".")[0]
  }

  const base = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000")
    .split(":")[0]
    .toLowerCase()

  if (hostname === base || hostname === "localhost" || hostname === "127.0.0.1") {
    return null
  }

  const suffix = `.${base}`
  if (hostname.endsWith(suffix)) {
    const sub = hostname.slice(0, -suffix.length)
    if (sub === "app" || sub === "www") return null
    return sub.split(".")[0]
  }

  return null
}

export const getAppContext = cache(
  async (): Promise<"builder" | "storefront"> => {
    const headerList = await headers()
    const ctx = headerList.get(CTX_HEADER)
    if (ctx === "storefront") return "storefront"
    if (ctx === "builder") return "builder"
    // Header absen → derive dari host.
    return tenantFromHost(headerList.get("host") ?? "") ? "storefront" : "builder"
  },
)

export const getTenantSubdomain = cache(async (): Promise<string | null> => {
  const headerList = await headers()
  const injected = headerList.get(TENANT_HEADER)
  const host = headerList.get("host") ?? ""
  return injected || tenantFromHost(host)
})
