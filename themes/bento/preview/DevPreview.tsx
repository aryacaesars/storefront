import { HomePage } from "@/themes/bento/pages/HomePage"
import type { ThemeConfig } from "@/themes/engine/schema"
import { BENTO_PREVIEW_CONFIG } from "./preview-config"
import { BentoPreviewShell } from "./BentoPreviewShell"

export function DevPreview({ config = BENTO_PREVIEW_CONFIG }: { config?: ThemeConfig }) {
  return (
    <BentoPreviewShell config={config}>
      <HomePage config={config} />
    </BentoPreviewShell>
  )
}
