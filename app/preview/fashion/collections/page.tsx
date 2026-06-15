import { Cormorant_Garamond } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import { Navbar } from "@/themes/fashion/sections/Navbar"
import { CollectionsPage } from "@/themes/fashion/pages/CollectionsPage"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export default function FashionCollectionsPreview() {
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
          <CollectionsPage />
        </div>
      </ThemeProvider>
    </div>
  )
}
