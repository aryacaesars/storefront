import { NextResponse } from "next/server"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getCatalogCategoriesForTenant } from "@/features/storefront/catalog"

export async function GET() {
  const tenantSlug = await getTenantSubdomain()
  const categories = await getCatalogCategoriesForTenant(tenantSlug)
  return NextResponse.json({ data: categories })
}
