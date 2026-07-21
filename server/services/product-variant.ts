export type ProductVariantInput = {
  id?: string
  label: string
  sku?: string | null
  size?: string | null
  color?: string | null
  price: number
  stock: number
  imageUrl?: string | null
}

export function buildVariantLabel(input: {
  label?: string
  size?: string | null
  color?: string | null
}): string {
  const explicit = input.label?.trim()
  if (explicit) return explicit
  const parts = [input.color?.trim(), input.size?.trim()].filter(Boolean)
  return parts.join(" / ") || "Default"
}

export function aggregateVariantTotals(variants: ProductVariantInput[]): {
  price: number
  stock: number
} {
  if (variants.length === 0) {
    return { price: 0, stock: 0 }
  }
  return {
    price: Math.min(...variants.map((v) => v.price)),
    stock: variants.reduce((sum, v) => sum + v.stock, 0),
  }
}

export function parseVariantsJson(raw: FormDataEntryValue | null): ProductVariantInput[] {
  if (!raw || typeof raw !== "string" || raw.trim() === "" || raw.trim() === "[]") {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const variants: ProductVariantInput[] = []
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue
      const row = entry as Record<string, unknown>
      const price = Number(row.price)
      const stock = Number(row.stock)
      const label = typeof row.label === "string" ? row.label.trim() : ""
      const size = typeof row.size === "string" ? row.size.trim() : ""
      const color = typeof row.color === "string" ? row.color.trim() : ""
      if (!label && !size && !color) continue
      if (!Number.isFinite(price) || price < 0) continue
      if (!Number.isFinite(stock) || stock < 0) continue
      variants.push({
        label: label || buildVariantLabel({ size, color }),
        sku: typeof row.sku === "string" ? row.sku.trim() : undefined,
        size: size || undefined,
        color: color || undefined,
        price,
        stock,
        imageUrl: typeof row.imageUrl === "string" ? row.imageUrl.trim() : undefined,
      })
    }
    return variants
  } catch {
    return []
  }
}
