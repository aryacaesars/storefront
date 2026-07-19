import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { PreviewLinkScope } from "@/themes/engine/preview-base-path"
import { Header, Footer } from "@/themes/bento"
import type { ThemeConfig } from "@/themes/engine/schema"
import { BENTO_PREVIEW_BASE } from "./constants"

interface BentoPreviewShellProps {
  children: ReactNode
  config: ThemeConfig
  showFooter?: boolean
}

export function BentoPreviewShell({
  children,
  config,
  showFooter = true,
}: BentoPreviewShellProps) {
  return (
    <PreviewLinkScope basePath={BENTO_PREVIEW_BASE}>
      <div className="min-h-full font-sans">
        <ThemeProvider config={config}>
          <Header config={config} basePath={BENTO_PREVIEW_BASE} />
          <main>{children}</main>
          {showFooter && <Footer config={config} />}
        </ThemeProvider>
      </div>
    </PreviewLinkScope>
  )
}
