import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import type { MockProductDetail } from "@/themes/bold/data/mock"

/** Maps live catalog data into the bold tech-series gallery shape. */
export function catalogToBoldDetail(product: CatalogProduct): MockProductDetail {
  const imageClass = product.imageClass

  type Thumbnail = { imageUrl?: string; imageClass: string; alt: string }

  // Create thumbnails from variants with images first, then add main product image
  const variantThumbnails: Thumbnail[] = (product.variants ?? [])
    .filter((variant) => variant.imageUrl)
    .map((variant) => ({
      imageUrl: variant.imageUrl,
      imageClass,
      alt: variant.label,
    }))

  const mainThumbnail: Thumbnail[] = product.imageUrl
    ? [{ imageUrl: product.imageUrl, imageClass, alt: product.name }]
    : [{ imageClass, alt: product.name }]

  const thumbnails = [...variantThumbnails, ...mainThumbnail]

  // Dedup hanya berdasarkan imageUrl; imageClass sama untuk semua thumbnail
  // sehingga tidak bisa dipakai sebagai kunci unik.
  const uniqueThumbnails = thumbnails.filter(
    (thumb, index, self) =>
      !thumb.imageUrl ||
      index === self.findIndex((t) => t.imageUrl === thumb.imageUrl)
  )

  // Try to parse optionSizes as numbers, if not possible, use empty array
  const parsedSizes = (product.optionSizes ?? []).map((s) => {
    const num = Number(s)
    return isNaN(num) ? undefined : num
  }).filter((num): num is number => num !== undefined)

  // Map optionColors to the shape MockProductDetail expects
  const mappedColors = (product.optionColors ?? []).map((color) => ({
    name: color,
    hex: "#808080", // Default grey, since we don't have actual hex values
  }))

  return {
    id: product.slug,
    seriesLabel: "",
    name: product.name.toUpperCase(),
    rating: 5,
    reviewCount: 0,
    price: product.salePrice ?? product.price,
    priceLabel: formatIdr(product.salePrice ?? product.price),
    badge: product.badge,
    colors: mappedColors,
    sizes: parsedSizes,
    defaultColor: product.optionColors?.[0] ?? "Default",
    defaultSize: parsedSizes[0] ?? 0,
    description: product.description,
    inStock: product.inStock,
    thumbnails: uniqueThumbnails,
    mainImageClass: imageClass,
    imageUrl: product.imageUrl,
  }
}
