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
  products: CatalogProduct[] | undefined,
  mockProducts: CatalogProduct[],
): ResolvedProductDetail {
  // products undefined = builder/preview (mock allowed); array = live tenant.
  const hasLiveFeed = products !== undefined || product != null
  const list = products ?? []

  const resolved =
    product ?? (slug ? list.find((p) => p.slug === slug) : undefined) ?? null

  if (resolved) {
    const pool = hasLiveFeed ? list : mockProducts
    return {
      product: resolved,
      related: pool.filter((p) => p.slug !== resolved.slug),
      isLiveCatalog: hasLiveFeed,
    }
  }

  if (hasLiveFeed) {
    return { product: null, related: list, isLiveCatalog: true }
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
