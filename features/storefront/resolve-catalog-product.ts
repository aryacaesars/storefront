import type { CatalogProduct } from "@/features/storefront/catalog-types"

export type ResolvedProductDetail = {
  product: CatalogProduct | null
  related: CatalogProduct[]
  /** True when tenant has a live catalog (not builder mock preview). */
  isLiveCatalog: boolean
}

/**
 * Resolves product detail from live catalog data with safe fallbacks:
 * 1. Detail API result (`product`)
 * 2. Match slug in catalog list (`products`)
 * 3. Mock preview items when catalog is not connected
 */
export function resolveProductDetail(
  slug: string | undefined,
  product: CatalogProduct | null | undefined,
  products: CatalogProduct[],
  mockProducts: CatalogProduct[],
): ResolvedProductDetail {
  const hasLiveFeed = products.length > 0 || product != null

  const resolved =
    product ?? (slug ? products.find((p) => p.slug === slug) : undefined) ?? null

  if (resolved) {
    const pool = products.length > 0 ? products : mockProducts
    return {
      product: resolved,
      related: pool.filter((p) => p.slug !== resolved.slug),
      isLiveCatalog: hasLiveFeed,
    }
  }

  if (hasLiveFeed) {
    return { product: null, related: products, isLiveCatalog: true }
  }

  const mock =
    (slug ? mockProducts.find((p) => p.slug === slug) : undefined) ??
    mockProducts[0] ??
    null

  if (!mock) {
    return { product: null, related: [], isLiveCatalog: false }
  }

  return {
    product: mock,
    related: mockProducts.filter((p) => p.slug !== mock.slug),
    isLiveCatalog: false,
  }
}
