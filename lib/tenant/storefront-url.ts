export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000"

export function getStorefrontHost(tenantSlug: string): string {
  if (!tenantSlug) return ROOT_DOMAIN
  return `${tenantSlug}.${ROOT_DOMAIN}`
}

export function getStorefrontUrl(tenantSlug: string): string {
  const protocol = ROOT_DOMAIN.includes("localhost") ? "http" : "https"
  return `${protocol}://${getStorefrontHost(tenantSlug)}`
}
