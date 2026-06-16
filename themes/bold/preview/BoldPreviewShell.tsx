import { Barlow_Condensed } from "next/font/google"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar } from "@/themes/bold"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import { BOLD_PREVIEW_BASE } from "./constants"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

interface BoldPreviewShellProps {
  children: ReactNode
  activeKey?: string
}

export function BoldPreviewShell({ children, activeKey }: BoldPreviewShellProps) {
  return (
    <div className={`${barlow.variable} min-h-full font-sans`}>
      <ThemeProvider config={DEFAULT_BOLD_CONFIG}>
        <Navbar
          config={DEFAULT_BOLD_CONFIG}
          basePath={BOLD_PREVIEW_BASE}
          activeKey={activeKey}
        />
        {children}
      </ThemeProvider>
    </div>
  )
}
