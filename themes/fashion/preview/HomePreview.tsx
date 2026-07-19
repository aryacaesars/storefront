import { HomePage } from "@/themes/fashion/pages/HomePage"
import type { ThemeConfig } from "@/themes/engine/schema"
import { FASHION_PREVIEW_CONFIG } from "./preview-config"
import { FashionPreviewShell } from "./FashionPreviewShell"

export function HomePreview({ config = FASHION_PREVIEW_CONFIG }: { config?: ThemeConfig }) {
  return (
    <FashionPreviewShell config={config}>
      <HomePage config={config} />
    </FashionPreviewShell>
  )
}
