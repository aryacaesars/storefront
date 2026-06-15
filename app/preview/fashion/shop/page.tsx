import { Cormorant_Garamond } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import { Navbar } from "@/themes/fashion/sections/Navbar"
import { ShopAllPage } from "@/themes/fashion/pages/ShopAllPage"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

export default function FashionShopPreview() {
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
          <ShopAllPage />
        </div>
      </ThemeProvider>
    </div>
  )
}
