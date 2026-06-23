import "server-only";

import { cache } from "react";
import { getTenantBySlug } from "@/server/services/tenant.service";
import {
  getStorefrontProductBySlug,
  listStorefrontItems,
} from "@/lib/scalev/endpoints/storefront";
import { StorefrontProductCardSchema } from "@/lib/scalev/schemas-storefront";
import {
  mapStorefrontProductCard,
  mapStorefrontProductDetail,
  type CatalogProduct,
} from "@/features/storefront/catalog-types";

export type TenantCatalogContext = {
  storeUniqueId: string;
  storefrontApiKey: string;
  storeName: string | null;
};

export const getTenantCatalogContext = cache(
  async (tenantSlug: string | null): Promise<TenantCatalogContext | null> => {
    if (!tenantSlug) return null;
    const tenant = await getTenantBySlug(tenantSlug);
    if (
      !tenant?.scalevStoreUniqueId ||
      !tenant.scalevStorefrontApiKey
    ) {
      return null;
    }
    return {
      storeUniqueId: tenant.scalevStoreUniqueId,
      storefrontApiKey: tenant.scalevStorefrontApiKey,
      storeName: tenant.scalevStoreName,
    };
  },
);

function isProductCard(
  item: unknown,
): item is import("@/lib/scalev/schemas-storefront").StorefrontProductCard {
  const parsed = StorefrontProductCardSchema.safeParse(item);
  return parsed.success;
}

export async function getCatalogProductsForTenant(
  tenantSlug: string | null,
): Promise<CatalogProduct[]> {
  const ctx = await getTenantCatalogContext(tenantSlug);
  if (!ctx) return [];

  try {
    const res = await listStorefrontItems(ctx.storeUniqueId, ctx.storefrontApiKey, {
      pageSize: 25,
    });
    return res.data
      .filter(isProductCard)
      .map((item) => mapStorefrontProductCard(item));
  } catch (e) {
    console.error(
      `[catalog] listStorefrontItems failed — storeUniqueId=${ctx.storeUniqueId} status=${(e as { status?: number }).status ?? "?"}`,
      (e as { body?: unknown }).body ?? e,
    );
    return [];
  }
}

export async function getCatalogProductBySlug(
  tenantSlug: string | null,
  slug: string,
): Promise<CatalogProduct | null> {
  const ctx = await getTenantCatalogContext(tenantSlug);
  if (!ctx) return null;

  try {
    const detail = await getStorefrontProductBySlug(
      ctx.storeUniqueId,
      ctx.storefrontApiKey,
      slug,
    );
    return mapStorefrontProductDetail(detail);
  } catch (e) {
    console.error("[catalog] getStorefrontProductBySlug failed:", e);
    return null;
  }
}
