import { Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Header, Footer } from "@/themes/minimalist"
import { HomePage } from "@/themes/minimalist/pages/HomePage"
import { DEFAULT_MINIMALIST_CONFIG } from "@/themes/minimalist/theme.config"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export function DevPreview() {
  return (
    <div className={`${playfair.variable} min-h-full font-sans`}>
      <ThemeProvider config={DEFAULT_MINIMALIST_CONFIG}>
        <Header config={DEFAULT_MINIMALIST_CONFIG} />
        <main>
          <HomePage />
        </main>
        <Footer config={DEFAULT_MINIMALIST_CONFIG} />
      </ThemeProvider>
    </div>
  )
}
