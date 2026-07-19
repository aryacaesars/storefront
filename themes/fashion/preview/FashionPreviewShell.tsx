import { Cormorant_Garamond } from "next/font/google"
import type { CSSProperties, ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { PreviewLinkScope } from "@/themes/engine/preview-base-path"
import { Navbar } from "@/themes/fashion/sections/Navbar"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"
import { FASHION_PREVIEW_BASE } from "./constants"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const themeVars = {
  "--theme-bg": "#FAFAF8",
  "--theme-text": "#1C1C1A",
  "--theme-muted": "#9C8F7E",
} as CSSProperties

interface FashionPreviewShellProps {
  children: ReactNode
  config?: ThemeConfig
}

export function FashionPreviewShell({
  children,
  config = DEFAULT_FASHION_CONFIG,
}: FashionPreviewShellProps) {
  return (
    <PreviewLinkScope basePath={FASHION_PREVIEW_BASE}>
      <div className={cormorant.variable}>
        <ThemeProvider config={config}>
          <div style={themeVars}>
            <Navbar config={config} basePath={FASHION_PREVIEW_BASE} />
            {children}
          </div>
        </ThemeProvider>
      </div>
    </PreviewLinkScope>
  )
}
