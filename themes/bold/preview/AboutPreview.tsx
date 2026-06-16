import { AboutPage } from "@/themes/bold/pages/AboutPage"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function AboutPreview() {
  return (
    <BoldPreviewShell activeKey="about">
      <AboutPage />
    </BoldPreviewShell>
  )
}
