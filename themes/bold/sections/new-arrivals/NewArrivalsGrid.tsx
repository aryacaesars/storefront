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
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const items = products ?? MOCK_PRODUCTS

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-500">
        Belum ada produk untuk ditampilkan.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product) => (
        <NewArrivalCard key={product.id} product={product} />
      ))}
    </div>
  )
}
