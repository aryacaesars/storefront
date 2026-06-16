import { AllProductsPage } from "@/themes/bold/pages/AllProductsPage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemeConfig } from "@/themes/engine/schema"

interface AllProductsStorePageProps {
  config: ThemeConfig
}

export function AllProductsStorePage({ config }: AllProductsStorePageProps) {
  return (
    <>
      <AllProductsPage />
      <PerformanceFooter config={config} />
    </>
  )
}
