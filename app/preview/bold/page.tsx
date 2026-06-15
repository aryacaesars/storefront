import { Barlow_Condensed } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar, Footer } from "@/themes/bold"
import { HomePage } from "@/themes/bold/pages/HomePage"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

export default function BoldPreviewPage() {
  return (
    <div className={`${barlow.variable} min-h-full font-sans`}>
      <ThemeProvider config={DEFAULT_BOLD_CONFIG}>
        <Navbar config={DEFAULT_BOLD_CONFIG} basePath="/preview/bold" />
        <main>
          <HomePage />
        </main>
        <Footer config={DEFAULT_BOLD_CONFIG} />
      </ThemeProvider>
    </div>
  )
}
