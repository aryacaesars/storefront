import { Playfair_Display } from "next/font/google"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { PreviewLinkScope } from "@/themes/engine/preview-base-path"
import { Header, Footer } from "@/themes/minimalist"
import type { ThemeConfig } from "@/themes/engine/schema"
import { MINIMALIST_PREVIEW_BASE } from "./constants"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

interface MinimalistPreviewShellProps {
  children: ReactNode
  config: ThemeConfig
  showFooter?: boolean
}

export function MinimalistPreviewShell({
  children,
  config,
  showFooter = true,
}: MinimalistPreviewShellProps) {
  return (
    <PreviewLinkScope basePath={MINIMALIST_PREVIEW_BASE}>
      <div className={`${playfair.variable} min-h-full font-sans`}>
        <ThemeProvider config={config}>
          <Header config={config} basePath={MINIMALIST_PREVIEW_BASE} />
          <main>{children}</main>
          {showFooter && <Footer config={config} />}
        </ThemeProvider>
      </div>
    </PreviewLinkScope>
  )
}
