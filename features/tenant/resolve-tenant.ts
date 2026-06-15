import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

const CTX_HEADER = "x-app-context"
const TENANT_HEADER = "x-tenant-subdomain"

export const getAppContext = cache(
  async (): Promise<"builder" | "storefront"> => {
    const headerList = await headers()
    return headerList.get(CTX_HEADER) === "storefront" ? "storefront" : "builder"
  },
)

export const getTenantSubdomain = cache(async (): Promise<string | null> => {
  const headerList = await headers()
  return headerList.get(TENANT_HEADER)
})
