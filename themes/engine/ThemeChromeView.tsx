import type { ReactNode } from "react"
import { Header, Footer as MinimalistFooter } from "@/themes/minimalist"
import { Header as BentoHeader, Footer as BentoFooter } from "@/themes/bento"
import { Navbar as BoldNavbar } from "@/themes/bold"
import { Navbar as FashionNavbar } from "@/themes/fashion/sections/Navbar"
import { CheckoutNavbar } from "@/features/storefront/CheckoutNavbar"
import type { ThemeConfig } from "./schema"

export type ChromeMode = "default" | "checkout"

interface ThemeChromeViewProps {
  config: ThemeConfig
  children: ReactNode
  cartCount?: number
  mode?: ChromeMode
  /** Nama customer yang sedang login — tampil di navbar dekat ikon profile. */
  customerName?: string | null
}

/**
 * Sync, client-safe chrome renderer (no next/headers). Dipakai langsung oleh
 * builder live preview; storefront memakai wrapper async <ThemeChrome/>.
 * flex-1 + main flex-1 menjaga footer di bawah saat konten pendek.
 */
export function ThemeChromeView({
  config,
  children,
  cartCount = 0,
  mode = "default",
  customerName,
}: ThemeChromeViewProps) {
  if (mode === "checkout") {
    const variant =
      config.templateId === "bold"
        ? "bold"
        : config.templateId === "bento"
          ? "bento"
          : config.templateId === "fashion"
            ? "fashion"
            : "minimalist"

    return (
      <div className="flex min-h-full flex-1 flex-col">
        <CheckoutNavbar config={config} variant={variant} />
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  switch (config.templateId) {
    case "bold":
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <BoldNavbar config={config} cartCount={cartCount} customerName={customerName} />
          <main className="flex-1">{children}</main>
        </div>
      )
    case "fashion":
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <FashionNavbar config={config} customerName={customerName} />
          <main className="flex-1">{children}</main>
        </div>
      )
    case "bento":
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <BentoHeader config={config} cartCount={cartCount} customerName={customerName} />
          <main className="flex-1">{children}</main>
          <BentoFooter config={config} />
        </div>
      )
    default:
      return (
        <div className="flex min-h-full flex-1 flex-col">
          <Header config={config} cartCount={cartCount} customerName={customerName} />
          <main className="flex-1">{children}</main>
          <MinimalistFooter config={config} />
        </div>
      )
  }
}
