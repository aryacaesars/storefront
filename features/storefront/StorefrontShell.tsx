import { Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/themes/engine/theme-provider"
import { Header, Footer } from "@/themes/minimalist"
import { getTenantSubdomain } from "@/features/tenant/resolve-tenant"
import { getThemeConfig } from "@/server/services/theme.service"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

export async function StorefrontShell({ children }: { children: React.ReactNode }) {
  const tenantSlug = await getTenantSubdomain()
  const config = await getThemeConfig(tenantSlug)

  return (
    <div className={`${playfair.variable} min-h-full font-sans`}>
      <ThemeProvider config={config}>
        <Header config={config} />
        <main>{children}</main>
        <Footer config={config} />
      </ThemeProvider>
    </div>
  )
}
