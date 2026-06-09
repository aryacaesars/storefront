import "server-only";
import type { MeResponse } from "@/lib/scalev/schemas";

/**
 * Platform tenant. MVP: derived in-memory from the Scalev identity (no DB).
 * Swap to a Prisma-backed upsert later (guide strict #3 — Tenant lives in
 * Prisma). Keep this interface stable so callers don't change.
 */
export interface Tenant {
  /** Platform tenant id. For now = Scalev business id. */
  id: string;
  scalevBusinessId: string;
  /** URL-safe subdomain key. */
  slug: string;
  name: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63);
}

/**
 * Build a Tenant from a Scalev identity's first ENABLED connected business.
 * Returns null if the merchant has no usable business.
 * Real /v3/me shape: business keyed by `unique_id` (string) + `username`
 * (url-safe handle). No numeric id / slug / store on this endpoint.
 */
export function resolveTenantFromIdentity(identity: MeResponse): Tenant | null {
  const businesses = identity.connected_businesses;
  // Prefer an enabled business; fall back to the first if none flagged.
  const biz =
    businesses.find((b) => b.is_enabled !== false) ?? businesses[0];
  if (!biz || !biz.unique_id) return null;

  const scalevBusinessId = biz.unique_id;
  // `username` is Scalev's url-safe handle → best subdomain key. Fall back to
  // a slugified name, then the business unique_id, so slug is never empty.
  const slug =
    (biz.username && biz.username.trim()) ||
    slugify(biz.name ?? "") ||
    scalevBusinessId;

  return {
    id: scalevBusinessId,
    scalevBusinessId,
    slug,
    name: biz.name ?? "Untitled Store",
  };
}

// TODO(Prisma): upsertTenant(tenant) -> persist to PostgreSQL; mint a stable
// platform id instead of reusing the Scalev business id.
