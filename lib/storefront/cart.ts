export type CartItem = {
  productId: string
  /** Unique cart line — productId or productId:variantId */
  lineKey: string
  slug: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  variantId?: string
  variantLabel?: string
  /** UI hints set server-side: when product now has variants and user must choose one */
  needsVariantSelection?: boolean
  /** Varian yang dipilih sudah dihapus dari data master produk */
  variantUnavailable?: boolean
  /** If price on product/variant differs from cart snapshot, currentPrice holds DB price */
  priceMismatch?: boolean
  currentPrice?: number
}

export function cartLineKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId
}

/** Normalize legacy cart cookies that only had slug-based identity. */
export function normalizeCartItem(raw: CartItem): CartItem {
  const lineKey = raw.lineKey || cartLineKey(raw.productId, raw.variantId)
  return { ...raw, lineKey }
}
