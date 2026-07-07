import { NEW_ARRIVALS } from "@/themes/bold/data/mock"
import { mapStorefrontProductCard } from "@/features/storefront/catalog-types"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { NewArrivalCard } from "@/themes/bold/sections/new-arrivals/NewArrivalCard"

const MOCK_PRODUCTS: CatalogProduct[] = NEW_ARRIVALS.map((p) =>
  mapStorefrontProductCard({
    id: p.id,
    slug: p.id,
    name: p.name,
    description: p.category,
    in_stock: true,
    price_range: { min: p.price, max: p.price },
    images: [],
  }),
)

interface NewArrivalsGridProps {
  products?: CatalogProduct[]
}

export function NewArrivalsGrid({ products }: NewArrivalsGridProps) {
  const items = products && products.length > 0 ? products : MOCK_PRODUCTS

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <NewArrivalCard key={product.id} product={product} />
      ))}
    </div>
  )
}
