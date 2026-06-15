import { Barlow_Condensed } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Navbar } from "@/themes/bold"
import { PerformancePage } from "@/themes/bold/pages/PerformancePage"
import { PerformanceFooter } from "@/themes/bold/sections/performance/PerformanceFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

export default function BoldPerformancePreview() {
  return (
    <div className={`${barlow.variable} min-h-full font-sans`}>
      <ThemeProvider config={DEFAULT_BOLD_CONFIG}>
        <Navbar config={DEFAULT_BOLD_CONFIG} basePath="/preview/bold" activeKey="performance" />
        <main>
          <PerformancePage allProductsHref="/preview/bold/all-products" />
        </main>
        <PerformanceFooter config={DEFAULT_BOLD_CONFIG} />
      </ThemeProvider>
    </div>
  )
}
