import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { getStoreBySlug } from "@/server/services/tenant.service";
import type { CatalogProduct } from "@/features/storefront/catalog-types";
import { gradientForId } from "@/features/storefront/catalog-types";

export type TenantCatalogContext = {
  storeUniqueId: string;
  storefrontApiKey: string;
  storeName: string | null;
};

export type StorefrontCategory = {
  id: string | number;
  name: string;
};

async function getStoreIdBySlug(tenantSlug: string | null): Promise<string | null> {
  if (!tenantSlug) return null;
  const store = await getStoreBySlug(tenantSlug);
  return store?.id ?? null;
}

// Not used by themes yet, kept for future
export async function getTenantCatalogContext(
  tenantSlug: string | null,
): Promise<TenantCatalogContext | null> {
  if (!tenantSlug) return null;
  const store = await getStoreBySlug(tenantSlug);
  if (!store) return null;
  return {
    storeUniqueId: store.id,
    storefrontApiKey: "",
    storeName: store.name,
  };
}

export const getCatalogProductsForTenant = cache(async function (
  tenantSlug: string | null,
): Promise<CatalogProduct[]> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return [];

  const products = await prisma.product.findMany({
    where: { storeId, published: true },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { name: "asc" },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.description?.trim() || p.name,
    price: p.price,
    imageUrl: p.images[0]?.url || undefined,
    imageClass: gradientForId(p.id),
    description: p.description ?? undefined,
    inStock: p.stock > 0,
  }));
});

export const getCatalogCategoriesForTenant = cache(async function (
  tenantSlug: string | null,
): Promise<StorefrontCategory[]> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return [];

  const categories = await prisma.category.findMany({
    where: { storeId },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({ id: c.id, name: c.name }));
});

export const getCatalogProductBySlug = cache(async function (
  tenantSlug: string | null,
  slug: string,
): Promise<CatalogProduct | null> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return null;

  const p = await prisma.product.findFirst({
    where: { storeId, slug, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.description?.trim() || p.name,
    price: p.price,
    imageUrl: p.images[0]?.url || undefined,
    imageClass: gradientForId(p.id),
    description: p.description ?? undefined,
    inStock: p.stock > 0,
  };
});
