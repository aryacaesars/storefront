import "server-only"

import { prisma } from "@/lib/db/prisma"
import type { MeResponse } from "@/lib/scalev/schemas"

/**
 * Platform tenant (1 Scalev connected business).
 * Persisted in PostgreSQL via Prisma.
 */
export interface Tenant {
  id: string
  scalevBusinessId: string
  /** URL-safe subdomain key. */
  slug: string
  name: string
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63)
}

/**
 * Build a Tenant from a Scalev identity's first ENABLED connected business.
 */
export function resolveTenantFromIdentity(identity: MeResponse): Tenant | null {
  const businesses = identity.connected_businesses
  const biz =
    businesses.find((b) => b.is_enabled !== false) ?? businesses[0]
  if (!biz || !biz.unique_id) return null

  const scalevBusinessId = biz.unique_id
  const slug =
    (biz.username && biz.username.trim()) ||
    slugify(biz.name ?? "") ||
    scalevBusinessId

  return {
    id: scalevBusinessId,
    scalevBusinessId,
    slug,
    name: biz.name ?? "Untitled Store",
  }
}

function toTenant(record: {
  id: string
  scalevBusinessId: string
  slug: string
  name: string
}): Tenant {
  return {
    id: record.id,
    scalevBusinessId: record.scalevBusinessId,
    slug: record.slug,
    name: record.name,
  }
}

/** Create or update tenant row on login / provisioning. */
export async function upsertTenant(input: Tenant): Promise<Tenant> {
  const record = await prisma.tenant.upsert({
    where: { scalevBusinessId: input.scalevBusinessId },
    create: {
      scalevBusinessId: input.scalevBusinessId,
      slug: input.slug,
      name: input.name,
    },
    update: {
      slug: input.slug,
      name: input.name,
    },
  })

  return toTenant(record)
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const record = await prisma.tenant.findUnique({ where: { slug } })
  return record ? toTenant(record) : null
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const record = await prisma.tenant.findUnique({ where: { id } })
  return record ? toTenant(record) : null
}
