import { Cormorant_Garamond } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar } from "@/themes/fashion/sections/Navbar"
import { HomePage } from "@/themes/fashion/pages/HomePage"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export default function FashionPreviewPage() {
  return (
    <div className={cormorant.variable}>
      <ThemeProvider config={DEFAULT_FASHION_CONFIG}>
        <div
          style={
            {
              "--theme-bg": "#FAFAF8",
              "--theme-text": "#1C1C1A",
              "--theme-muted": "#9C8F7E",
            } as React.CSSProperties
          }
        >
          <Navbar config={DEFAULT_FASHION_CONFIG} basePath="/preview/fashion" />
          <HomePage />
        </div>
      </ThemeProvider>
    </div>
  )
}
