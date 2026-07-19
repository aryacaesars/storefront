import { AllProductsPage } from "@/themes/bold/pages/AllProductsPage"
import { Footer } from "@/themes/bold/sections/Footer"
import type { ThemePageProps } from "@/themes/engine/page-props"

/** Halaman /products — katalog penuh (ex all-products). */
export function ProductListPage({
  config,
  products = [],
  categories = [],
  priceBounds = null,
  catalogFilters = {},
}: ThemePageProps) {
  return (
    <>
      <AllProductsPage
        products={products}
        categories={categories}
        priceBounds={priceBounds}
        catalogFilters={catalogFilters}
      />
      <Footer config={config} />
    </>
  )
}
