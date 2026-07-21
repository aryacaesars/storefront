import type { CatalogProduct, CatalogProductVariant } from "@/features/storefront/catalog-types"

export function productHasVariants(product: CatalogProduct): boolean {
  return (product.variants?.length ?? 0) > 0
}

/**
 * True bila varian memakai dimensi ukuran/warna (produk fashion). Bila false
 * tapi tetap punya varian (mis. makanan: "Level Pedas", "Porsi"), pemilihan
 * dilakukan langsung per label varian, bukan per dimensi.
 */
export function productHasOptionDimensions(product: CatalogProduct): boolean {
  return (
    (product.optionSizes?.length ?? 0) > 0 ||
    (product.optionColors?.length ?? 0) > 0
  )
}

/**
 * True bila semua dimensi opsi yang tersedia (ukuran/warna) sudah dipilih.
 * Produk dengan varian tanpa opsi ukuran/warna dianggap selalu lengkap
 * (tidak ada UI pilihan yang bisa diklik user).
 */
export function isVariantSelectionComplete(
  product: CatalogProduct,
  selected: { size?: string; color?: string },
): boolean {
  if ((product.optionSizes?.length ?? 0) > 0 && !selected.size) return false
  if ((product.optionColors?.length ?? 0) > 0 && !selected.color) return false
  return true
}

export function resolveSelectedVariant(
  product: CatalogProduct,
  selected: { size?: string; color?: string; variantId?: string },
): CatalogProductVariant | null {
  const variants = product.variants ?? []
  if (variants.length === 0) return null

  if (selected.variantId) {
    return variants.find((v) => v.id === selected.variantId) ?? null
  }

  const matches = variants.filter((variant) => {
    if (selected.size && variant.size !== selected.size) return false
    if (selected.color && variant.color !== selected.color) return false
    return true
  })

  if (matches.length === 1) return matches[0]
  return matches.find((v) => v.stock > 0) ?? matches[0] ?? null
}

export function formatCatalogPriceRange(product: CatalogProduct): string {
  if (product.priceMax != null && product.priceMax > product.price) {
    return `${product.price}–${product.priceMax}`
  }
  return String(product.price)
}
