import { Footer } from "@/themes/bold"
import { HomePage } from "@/themes/bold/pages/HomePage"
import type { ThemeConfig } from "@/themes/engine/schema"
import { BOLD_PREVIEW_CONFIG } from "./preview-config"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function HomePreview({ config = BOLD_PREVIEW_CONFIG }: { config?: ThemeConfig }) {
  return (
    <BoldPreviewShell config={config} transparent>
      <main>
        <HomePage config={config} />
      </main>
      <Footer config={config} />
    </BoldPreviewShell>
  )
}
