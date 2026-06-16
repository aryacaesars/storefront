import { Cormorant_Garamond } from "next/font/google"
import type { CSSProperties, ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar } from "@/themes/fashion/sections/Navbar"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
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
}

export function FashionPreviewShell({ children }: FashionPreviewShellProps) {
  return (
    <div className={cormorant.variable}>
      <ThemeProvider config={DEFAULT_FASHION_CONFIG}>
        <div style={themeVars}>
          <Navbar config={DEFAULT_FASHION_CONFIG} basePath={FASHION_PREVIEW_BASE} />
          {children}
        </div>
      </ThemeProvider>
    </div>
  )
}
