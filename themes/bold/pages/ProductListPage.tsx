import { PerformancePage } from "@/themes/bold/pages/PerformancePage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import type { ThemeConfig } from "@/themes/engine/schema"

interface ProductListPageProps {
  config: ThemeConfig
}

export function ProductListPage({ config }: ProductListPageProps) {
  return (
    <>
      <PerformancePage allProductsHref="/all-products" />
      <PerformanceFooter config={config} />
    </>
  )
}
