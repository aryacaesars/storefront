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
 * Build a Tenant from a Scalev identity's first connected business.
 * Returns null if the merchant has no connected business.
 * ⚠️ Uses ASSUMPTION fields (connected_businesses[].id/name/slug) — confirm
 * the real shape week 1.
 */
export function resolveTenantFromIdentity(identity: MeResponse): Tenant | null {
  const biz = identity.connected_businesses[0];
  if (!biz) return null;

  const scalevBusinessId = String(biz.id);
  // biz.slug may be null/undefined OR an empty string; slugify() yields "" for
  // names with no ASCII alphanumerics (unicode/symbol-only, e.g. CJK store names).
  // Always fall back to the business id so tenant.slug is never empty — it drives
  // subdomain routing.
  const slug =
    (biz.slug && biz.slug.trim()) || slugify(biz.name ?? "") || scalevBusinessId;

  return {
    id: scalevBusinessId,
    scalevBusinessId,
    slug,
    // ⚠️ If after a REAL login slug = <numeric id> and name = "Untitled Store",
    // that's a SIGNAL the name/slug KEY assumption is wrong (id is the only
    // required business field) — confirm week 1, not a normal state.
    name: biz.name ?? "Untitled Store",
  };
}

// TODO(Prisma): upsertTenant(tenant) -> persist to PostgreSQL; mint a stable
// platform id instead of reusing the Scalev business id.
