import { HomePage } from "@/themes/minimalist/pages/HomePage"
import type { ThemeConfig } from "@/themes/engine/schema"
import { MINIMALIST_PREVIEW_CONFIG } from "./preview-config"
import { MinimalistPreviewShell } from "./MinimalistPreviewShell"

export function DevPreview({
  config = MINIMALIST_PREVIEW_CONFIG,
}: {
  config?: ThemeConfig
}) {
  return (
    <MinimalistPreviewShell config={config}>
      <HomePage config={config} />
    </MinimalistPreviewShell>
  )
}
