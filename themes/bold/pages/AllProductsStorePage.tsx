import { AllProductsPage } from "@/themes/bold/pages/AllProductsPage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function AllProductsStorePage({ config, products = [] }: ThemePageProps) {
  return (
    <>
      <AllProductsPage products={products} />
      <PerformanceFooter config={config} />
    </>
  )
}
