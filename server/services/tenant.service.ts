import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { MeResponse } from "@/lib/scalev/schemas";
import {
  createStorefrontPublicApiKey,
  listSimplifiedStores,
  listStorefrontItems,
  registerStorefrontAllowedOrigin,
} from "@/lib/scalev/endpoints/storefront";
import { ScalevError } from "@/lib/scalev/client";
import { getStorefrontUrl } from "@/lib/tenant/storefront-url";

/**
 * Platform tenant (1 Scalev connected business).
 * Persisted in PostgreSQL via Prisma.
 */
export interface Tenant {
  id: string;
  scalevBusinessId: string;
  /** URL-safe subdomain key. */
  slug: string;
  name: string;
  scalevStoreNumericId: number | null;
  scalevStoreUniqueId: string | null;
  scalevStoreName: string | null;
  scalevStorefrontApiKey: string | null;
  catalogConnectedAt: Date | null;
  catalogProductCount: number | null;
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
 */
export function resolveTenantFromIdentity(identity: MeResponse): Tenant | null {
  const businesses = identity.connected_businesses;
  const biz =
    businesses.find((b) => b.is_enabled !== false) ?? businesses[0];
  if (!biz || !biz.unique_id) return null;

  const scalevBusinessId = biz.unique_id;
  const slug =
    (biz.username && biz.username.trim()) ||
    slugify(biz.name ?? "") ||
    scalevBusinessId;

  return {
    id: scalevBusinessId,
    scalevBusinessId,
    slug,
    name: biz.name ?? "Untitled Store",
    scalevStoreNumericId: null,
    scalevStoreUniqueId: null,
    scalevStoreName: null,
    scalevStorefrontApiKey: null,
    catalogConnectedAt: null,
    catalogProductCount: null,
  };
}

function toTenant(record: {
  id: string;
  scalevBusinessId: string;
  slug: string;
  name: string;
  scalevStoreNumericId: number | null;
  scalevStoreUniqueId: string | null;
  scalevStoreName: string | null;
  scalevStorefrontApiKey: string | null;
  catalogConnectedAt: Date | null;
  catalogProductCount: number | null;
}): Tenant {
  return {
    id: record.id,
    scalevBusinessId: record.scalevBusinessId,
    slug: record.slug,
    name: record.name,
    scalevStoreNumericId: record.scalevStoreNumericId,
    scalevStoreUniqueId: record.scalevStoreUniqueId,
    scalevStoreName: record.scalevStoreName,
    scalevStorefrontApiKey: record.scalevStorefrontApiKey,
    catalogConnectedAt: record.catalogConnectedAt,
    catalogProductCount: record.catalogProductCount,
  };
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
  });

  return toTenant(record);
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const record = await prisma.tenant.findUnique({ where: { slug } });
  return record ? toTenant(record) : null;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const record = await prisma.tenant.findUnique({ where: { id } });
  return record ? toTenant(record) : null;
}

export function isCatalogConnected(tenant: Tenant): boolean {
  return Boolean(
    tenant.scalevStoreUniqueId &&
      tenant.scalevStorefrontApiKey &&
      tenant.catalogConnectedAt,
  );
}

export type ConnectCatalogInput = {
  tenantId: string;
  tenantSlug: string;
  scalevToken: string;
  storeNumericId: number;
};

export type ConnectCatalogResult = {
  storeName: string;
  productCount: number;
  storefrontUrl: string;
};

export async function connectTenantCatalog(
  input: ConnectCatalogInput,
): Promise<ConnectCatalogResult> {
  const stores = await listSimplifiedStores(input.scalevToken);
  const selected = stores.find(
    (s) => Number(s.id) === input.storeNumericId,
  );
  if (!selected?.unique_id) {
    throw new Error("Store tidak ditemukan di akun Scalev Anda.");
  }

  const storeNumericId = Number(selected.id);
  const storeUniqueId = selected.unique_id;
  const storeName = selected.name?.trim() || "Scalev Store";

  const existingTenant = await getTenantById(input.tenantId);
  const reuseExistingKey =
    existingTenant?.scalevStorefrontApiKey &&
    existingTenant.scalevStoreNumericId === storeNumericId;

  let storefrontApiKey: string;
  if (reuseExistingKey) {
    storefrontApiKey = existingTenant.scalevStorefrontApiKey!;
  } else {
    try {
      storefrontApiKey = await createStorefrontPublicApiKey(
        input.scalevToken,
        storeNumericId,
      );
    } catch (e) {
      if (e instanceof ScalevError && e.status === 409) {
        // Key already exists for this store but not in our DB (e.g. created externally).
        // We cannot retrieve the raw token again — user must revoke it in Scalev dashboard
        // and reconnect, or use a different store.
        throw new Error(
          "Storefront API key sudah ada di store ini tapi tidak tersimpan di sistem. " +
          "Hapus key di Scalev dashboard (Store → Storefront API Keys), lalu coba hubungkan lagi.",
        );
      }
      if (e instanceof ScalevError) {
        throw new Error(
          `Gagal membuat Storefront API key (HTTP ${e.status}). Pastikan API key merchant punya scope store:update.`,
        );
      }
      throw e;
    }
  }

  const origin = getStorefrontUrl(input.tenantSlug);
  try {
    await registerStorefrontAllowedOrigin(
      input.scalevToken,
      storeNumericId,
      origin,
    );
  } catch (e) {
    // Origin may already exist — non-fatal for reconnect.
    if (!(e instanceof ScalevError) || (e.status !== 400 && e.status !== 409)) {
      console.warn("[connect] allowed origin registration:", e);
    }
  }

  let productCount = 0;
  try {
    const items = await listStorefrontItems(storeUniqueId, storefrontApiKey, { pageSize: 100 });
    productCount = items.data.length;
  } catch {
    // Preview count is best-effort; storefront public feed is source of truth.
  }

  await prisma.tenant.update({
    where: { id: input.tenantId },
    data: {
      scalevStoreNumericId: storeNumericId,
      scalevStoreUniqueId: storeUniqueId,
      scalevStoreName: storeName,
      scalevStorefrontApiKey: storefrontApiKey,
      catalogConnectedAt: new Date(),
      catalogProductCount: productCount,
    },
  });

  return {
    storeName,
    productCount,
    storefrontUrl: origin,
  };
}
