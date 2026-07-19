import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { readCustomerSession } from "@/lib/storefront/customer-session"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getStoreBySlug } from "@/server/services/tenant.service"
import { prisma } from "@/lib/db/prisma"

export type CustomerSession = {
  customerId: string
  storeId: string
  email: string
  name: string | null
  phone: string | null
}

/** Returns the logged-in customer for the CURRENT store, or null. No redirect. */
export const getCustomerSession = cache(async (): Promise<CustomerSession | null> => {
  const session = await readCustomerSession()
  if (!session) return null

  const slug = await getTenantSubdomain()
  if (!slug) return null
  const store = await getStoreBySlug(slug)
  if (!store || store.id !== session.storeId) return null

  const customer = await prisma.customer.findFirst({
    where: { id: session.customerId, storeId: store.id },
    select: { id: true, email: true, name: true, phone: true },
  })
  if (!customer) return null

  return {
    customerId: customer.id,
    storeId: store.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
  }
})

/** Require a logged-in customer; redirect to /signin if absent. */
export async function requireCustomer(): Promise<CustomerSession> {
  const session = await getCustomerSession()
  if (!session) redirect("/signin")
  return session
}

/** Resolve the current tenant's store id (for signin/signup actions). */
export async function getCurrentStoreId(): Promise<string | null> {
  const slug = await getTenantSubdomain()
  if (!slug) return null
  const store = await getStoreBySlug(slug)
  return store?.id ?? null
}
