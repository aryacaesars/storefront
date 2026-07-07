import { TechSeriesPage } from "@/themes/bold/pages/TechSeriesPage"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function TechSeriesPreview() {
  return (
    <BoldPreviewShell activeKey="tech-series">
      <TechSeriesPage />
    </BoldPreviewShell>
  )
}
