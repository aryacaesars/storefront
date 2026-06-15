import { Barlow_Condensed } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar } from "@/themes/bold"
import { NewArrivalsPage } from "@/themes/bold/pages/NewArrivalsPage"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

export default function BoldNewArrivalsPreview() {
  return (
    <div className={`${barlow.variable} min-h-full font-sans`}>
      <ThemeProvider config={DEFAULT_BOLD_CONFIG}>
        <Navbar config={DEFAULT_BOLD_CONFIG} basePath="/preview/bold" activeKey="new-arrivals" />
        <NewArrivalsPage />
      </ThemeProvider>
    </div>
  )
}
