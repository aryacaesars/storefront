import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { formatIdr } from "@/features/storefront/catalog-types"
import type { MockProductDetail } from "@/themes/bold/data/mock"

/** Maps live catalog data into the bold tech-series gallery shape. */
export function catalogToBoldDetail(product: CatalogProduct): MockProductDetail {
  const imageClass = product.imageClass
  return {
    id: product.slug,
    seriesLabel: "",
    name: product.name.toUpperCase(),
    rating: 5,
    reviewCount: 0,
    price: product.salePrice ?? product.price,
    priceLabel: formatIdr(product.salePrice ?? product.price),
    badge: product.badge,
    colors: [],
    sizes: [],
    defaultColor: "Default",
    defaultSize: 0,
    description: product.description,
    inStock: product.inStock,
    thumbnails: [{ imageClass, alt: product.name }],
    mainImageClass: imageClass,
    imageUrl: product.imageUrl,
  }
}
