import { NewArrivalsPage } from "@/themes/bold/pages/NewArrivalsPage"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function NewArrivalsPreview() {
  return (
    <BoldPreviewShell activeKey="new-arrivals">
      <NewArrivalsPage />
    </BoldPreviewShell>
  )
}
