import { Barlow_Condensed } from "next/font/google"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { PreviewLinkScope } from "@/themes/engine/preview-base-path"
import { Navbar } from "@/themes/bold"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"
import { BOLD_PREVIEW_BASE } from "./constants"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

interface BoldPreviewShellProps {
  children: ReactNode
  activeKey?: string
  config?: ThemeConfig
  /** Overlay transparan di atas hero gelap — hanya untuk homepage. */
  transparent?: boolean
}

export function BoldPreviewShell({
  children,
  activeKey,
  config = DEFAULT_BOLD_CONFIG,
  transparent = false,
}: BoldPreviewShellProps) {
  return (
    <PreviewLinkScope basePath={BOLD_PREVIEW_BASE}>
      <div className={`${barlow.variable} relative min-h-full font-sans`}>
        <ThemeProvider config={config}>
          <Navbar
            config={config}
            basePath={BOLD_PREVIEW_BASE}
            activeKey={activeKey}
            transparent={transparent}
          />
          {children}
        </ThemeProvider>
      </div>
    </PreviewLinkScope>
  )
}
