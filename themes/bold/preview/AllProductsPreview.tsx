import { AllProductsPage } from "@/themes/bold/pages/AllProductsPage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function AllProductsPreview() {
  return (
    <BoldPreviewShell>
      <AllProductsPage />
      <PerformanceFooter config={DEFAULT_BOLD_CONFIG} />
    </BoldPreviewShell>
  )
}
