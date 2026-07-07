import type { ReactNode } from "react"
import { Header, Footer as MinimalistFooter } from "@/themes/minimalist"
import { Header as BentoHeader, Footer as BentoFooter } from "@/themes/bento"
import { Navbar as BoldNavbar } from "@/themes/bold"
import { Navbar as FashionNavbar } from "@/themes/fashion/sections/Navbar"
import type { ThemeConfig } from "./schema"

interface ThemeChromeViewProps {
  config: ThemeConfig
  children: ReactNode
  cartCount?: number
}

/**
 * Sync, client-safe chrome renderer (no next/headers). Dipakai langsung oleh
 * builder live preview; storefront memakai wrapper async <ThemeChrome/>.
 */
export function ThemeChromeView({ config, children, cartCount = 0 }: ThemeChromeViewProps) {
  switch (config.templateId) {
    case "bold":
      return (
        <>
          <BoldNavbar config={config} cartCount={cartCount} />
          {children}
        </>
      )
    case "fashion":
      return (
        <>
          <FashionNavbar config={config} />
          {children}
        </>
      )
    case "bento":
      return (
        <>
          <BentoHeader config={config} cartCount={cartCount} />
          {children}
          <BentoFooter config={config} />
        </>
      )
    default:
      return (
        <>
          <Header config={config} cartCount={cartCount} />
          {children}
          <MinimalistFooter config={config} />
        </>
      )
  }
}
