import { headers } from "next/headers"

const TENANT_HEADER = "x-tenant-subdomain"
const CTX_HEADER = "x-app-context"

export async function getTenantSubdomain(): Promise<string | null> {
  const h = await headers()
  return h.get(TENANT_HEADER)
}

export async function getAppContext(): Promise<"builder" | "storefront"> {
  const h = await headers()
  return h.get(CTX_HEADER) === "storefront" ? "storefront" : "builder"
}
