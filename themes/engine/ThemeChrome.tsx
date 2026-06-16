import type { ReactNode } from "react"
import { Header, Footer as MinimalistFooter } from "@/themes/minimalist"
import { Header as BentoHeader, Footer as BentoFooter } from "@/themes/bento"
import { Navbar as BoldNavbar } from "@/themes/bold"
import { Navbar as FashionNavbar } from "@/themes/fashion/sections/Navbar"
import type { ThemeConfig } from "./schema"

interface ThemeChromeProps {
  config: ThemeConfig
  children: ReactNode
}

/** Header/nav + optional footer untuk halaman storefront non-home. */
export function ThemeChrome({ config, children }: ThemeChromeProps) {
  switch (config.templateId) {
    case "bold":
      return (
        <>
          <BoldNavbar config={config} />
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
          <BentoHeader config={config} />
          {children}
          <BentoFooter config={config} />
        </>
      )
    default:
      return (
        <>
          <Header config={config} />
          {children}
          <MinimalistFooter config={config} />
        </>
      )
  }
}
