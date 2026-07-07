import { PerformancePage } from "@/themes/bold/pages/PerformancePage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import { BoldPreviewShell } from "./BoldPreviewShell"
import { BOLD_PREVIEW_BASE } from "./constants"

export function PerformancePreview() {
  return (
    <BoldPreviewShell activeKey="performance">
      <main>
        <PerformancePage allProductsHref={`${BOLD_PREVIEW_BASE}/all-products`} />
      </main>
      <PerformanceFooter config={DEFAULT_BOLD_CONFIG} />
    </BoldPreviewShell>
  )
}
