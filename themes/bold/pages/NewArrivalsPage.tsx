import { NewArrivalsSortClient } from "@/themes/bold/sections/new-arrivals/NewArrivalsSortClient"
import { EliteNewsletter } from "@/themes/bold/sections/new-arrivals/EliteNewsletter"
import { NewArrivalsFooter } from "@/themes/bold/sections/new-arrivals/NewArrivalsFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"
import type { CatalogProduct } from "@/features/storefront/catalog-types"
import { NEW_ARRIVALS } from "@/themes/bold/data/mock"
import { mapStorefrontProductCard } from "@/features/storefront/catalog-types"

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

interface NewArrivalsPageProps {
  config?: ThemeConfig
  products?: CatalogProduct[]
}

export function NewArrivalsPage({ config = DEFAULT_BOLD_CONFIG, products }: NewArrivalsPageProps) {
  // products undefined = builder/preview (mock); array (walau kosong) = live.
  const items = products ?? MOCK_PRODUCTS

  return (
    <div className="min-h-screen bg-zinc-50">
      <NewArrivalsSortClient products={items} />
      <EliteNewsletter />
      <NewArrivalsFooter config={config} />
    </div>
  )
}
