import "server-only";

// TODO Sprint 2: reconnect to Prisma data source — Scalev storefront API removed
// import { cache } from "react";
// import { getTenantBySlug } from "@/server/services/tenant.service";
// import { getStorefrontProductBySlug, listStorefrontItems, listStorefrontCategories } from "@/lib/scalev/endpoints/storefront";
// import { StorefrontProductCardSchema } from "@/lib/scalev/schemas-storefront";
// import type { StorefrontCategory } from "@/lib/scalev/schemas-storefront";
import type {
  CatalogProduct,
} from "@/features/storefront/catalog-types";

export type TenantCatalogContext = {
  storeUniqueId: string;
  storefrontApiKey: string;
  storeName: string | null;
};

// TODO Sprint 2: reconnect to Prisma data source
export async function getTenantCatalogContext(
  _tenantSlug: string | null,
): Promise<TenantCatalogContext | null> {
  return null;
}

export async function getCatalogProductsForTenant(
  _tenantSlug: string | null,
): Promise<CatalogProduct[]> {
  // TODO Sprint 2: reconnect to Prisma data source
  return [];
}

// TODO Sprint 2: reconnect to Prisma data source
export type StorefrontCategory = {
  id: string | number;
  name: string;
};

export async function getCatalogCategoriesForTenant(
  _tenantSlug: string | null,
): Promise<StorefrontCategory[]> {
  // TODO Sprint 2: reconnect to Prisma data source
  return [];
}

export async function getCatalogProductBySlug(
  _tenantSlug: string | null,
  _slug: string,
): Promise<CatalogProduct | null> {
  // TODO Sprint 2: reconnect to Prisma data source
  return null;
}
