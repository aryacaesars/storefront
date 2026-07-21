import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { getStoreBySlug } from "@/server/services/tenant.service";
import type { CatalogProduct, StorefrontCategory, CatalogListFilters } from "@/features/storefront/catalog-types";
import { gradientForId } from "@/features/storefront/catalog-types";

export type TenantCatalogContext = {
  storeUniqueId: string;
  storefrontApiKey: string;
  storeName: string | null;
};

export type CatalogListResult = {
  products: CatalogProduct[];
  categories: StorefrontCategory[];
  priceBounds: { min: number; max: number } | null;
};

export type {
  StorefrontCategory,
  CatalogListFilters,
  CatalogSort,
} from "@/features/storefront/catalog-types";
export { parseCatalogSearchParams } from "@/features/storefront/catalog-types";

function mapProductToCatalog(
  p: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    images: { url: string }[];
    variants?: Array<{
      id: string;
      label: string;
      sku: string | null;
      size: string | null;
      color: string | null;
      price: number;
      stock: number;
      imageUrl: string | null;
    }>;
  },
): CatalogProduct {
  const variants = (p.variants ?? []).map((variant) => ({
    id: variant.id,
    label: variant.label,
    sku: variant.sku ?? undefined,
    size: variant.size ?? undefined,
    color: variant.color ?? undefined,
    price: variant.price,
    stock: variant.stock,
    imageUrl: variant.imageUrl ?? undefined,
  }));

  const hasVariants = variants.length > 0;
  const prices = hasVariants ? variants.map((v) => v.price) : [p.price];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const inStock = hasVariants
    ? variants.some((v) => v.stock > 0)
    : p.stock > 0;
  const optionSizes = [
    ...new Set(variants.map((v) => v.size).filter(Boolean) as string[]),
  ];
  const optionColors = [
    ...new Set(variants.map((v) => v.color).filter(Boolean) as string[]),
  ];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.description?.trim() || p.name,
    price: minPrice,
    priceMax: maxPrice > minPrice ? maxPrice : undefined,
    imageUrl:
      p.images[0]?.url ||
      variants.find((v) => v.imageUrl)?.imageUrl ||
      undefined,
    imageClass: gradientForId(p.id),
    description: p.description ?? undefined,
    inStock,
    variants: hasVariants ? variants : undefined,
    optionSizes: optionSizes.length > 0 ? optionSizes : undefined,
    optionColors: optionColors.length > 0 ? optionColors : undefined,
  };
}

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
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return products.map(mapProductToCatalog);
});

/**
 * Katalog terfilter untuk halaman /products.
 * Filter: q (nama/deskripsi), category slug, min/max harga, stok, sort (name|price|popular).
 */
export const getFilteredCatalogProductsForTenant = cache(async function (
  tenantSlug: string | null,
  filters: CatalogListFilters = {},
): Promise<CatalogListResult> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) {
    return { products: [], categories: [], priceBounds: null };
  }

  const [categories, priceAgg] = await Promise.all([
    prisma.category.findMany({
      where: { storeId },
      orderBy: { name: "asc" },
    }),
    prisma.product.aggregate({
      where: { storeId, published: true },
      _min: { price: true },
      _max: { price: true },
    }),
  ]);

  const priceBounds =
    priceAgg._min.price != null && priceAgg._max.price != null
      ? { min: priceAgg._min.price, max: priceAgg._max.price }
      : null;

  const where = {
    storeId,
    published: true as const,
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" as const } },
            {
              description: {
                contains: filters.q,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.minPrice != null || filters.maxPrice != null
      ? {
          price: {
            ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.inStock ? { stock: { gt: 0 } } : {}),
  };

  const sort = filters.sort ?? "name";

  if (sort === "popular") {
    const products = await prisma.product.findMany({
      where,
      include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    });

    if (products.length === 0) {
      return {
        products: [],
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
        priceBounds,
      };
    }

    const sold = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: products.map((p) => p.id) },
        order: { storeId, status: "PAID" },
      },
      _sum: { quantity: true },
    });
    const qtyById = new Map(
      sold.map((row) => [row.productId, row._sum.quantity ?? 0]),
    );

    const ordered = [...products].sort((a, b) => {
      const diff = (qtyById.get(b.id) ?? 0) - (qtyById.get(a.id) ?? 0);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

    return {
      products: ordered.map(mapProductToCatalog),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      priceBounds,
    };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : { name: "asc" as const };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy,
  });

  return {
    products: products.map(mapProductToCatalog),
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
    priceBounds,
  };
});

/**
 * Produk terlaris (sum qty OrderItem pada order PAID).
 * Slot sisa diisi produk published lain (name asc) bila penjualan < limit.
 */
export const getTrendingCatalogProductsForTenant = cache(async function (
  tenantSlug: string | null,
  limit = 8,
): Promise<CatalogProduct[]> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return [];

  const sold = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: { storeId, status: "PAID" },
      product: { storeId, published: true },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const rankedIds = sold.map((row) => row.productId);
  const rankedProducts =
    rankedIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: rankedIds }, storeId, published: true },
          include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
        })
      : [];

  const byId = new Map(rankedProducts.map((p) => [p.id, p]));
  const ordered: CatalogProduct[] = [];
  for (const id of rankedIds) {
    const p = byId.get(id);
    if (p) ordered.push(mapProductToCatalog(p));
  }

  if (ordered.length >= limit) return ordered.slice(0, limit);

  const filler = await prisma.product.findMany({
    where: {
      storeId,
      published: true,
      ...(rankedIds.length > 0 ? { id: { notIn: rankedIds } } : {}),
    },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { name: "asc" },
    take: limit - ordered.length,
  });

  return [...ordered, ...filler.map(mapProductToCatalog)];
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

  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
});

export const getCatalogCategoryBySlug = cache(async function (
  tenantSlug: string | null,
  slug: string,
): Promise<StorefrontCategory | null> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return null;

  const category = await prisma.category.findFirst({
    where: { storeId, slug },
  });

  if (!category) return null;

  return { id: category.id, name: category.name, slug: category.slug };
});

export const getCatalogProductsByCategorySlug = cache(async function (
  tenantSlug: string | null,
  slug: string,
): Promise<CatalogProduct[]> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return [];

  const products = await prisma.product.findMany({
    where: {
      storeId,
      published: true,
      category: { slug },
    },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  return products.map(mapProductToCatalog);
});

export const getCatalogProductBySlug = cache(async function (
  tenantSlug: string | null,
  slug: string,
): Promise<CatalogProduct | null> {
  const storeId = await getStoreIdBySlug(tenantSlug);
  if (!storeId) return null;

  const p = await prisma.product.findFirst({
    where: { storeId, slug, published: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!p) return null;

  return mapProductToCatalog(p);
});
