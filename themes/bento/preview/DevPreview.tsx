import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Header, Footer } from "@/themes/bento"
import { HomePage } from "@/themes/bento/pages/HomePage"
import { DEFAULT_BENTO_CONFIG } from "@/themes/bento/theme.config"

export function DevPreview() {
  return (
    <div className="min-h-full font-sans">
      <ThemeProvider config={DEFAULT_BENTO_CONFIG}>
        <Header config={DEFAULT_BENTO_CONFIG} />
        <main>
          <HomePage />
        </main>
        <Footer config={DEFAULT_BENTO_CONFIG} />
      </ThemeProvider>
    </div>
  )
}
