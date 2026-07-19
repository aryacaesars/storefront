import type { ReactNode } from "react"
import { cookies } from "next/headers"
import type { CartItem } from "@/lib/storefront/cart"
import type { ThemeConfig } from "./schema"
import { ThemeChromeView, type ChromeMode } from "./ThemeChromeView"

interface ThemeChromeProps {
  config: ThemeConfig
  children: ReactNode
  mode?: ChromeMode
}

async function getCartCount(): Promise<number> {
  const store = await cookies()
  const raw = store.get("sf_cart")?.value
  if (!raw) return 0
  try {
    const items = JSON.parse(raw) as CartItem[]
    return items.reduce((sum, item) => sum + item.quantity, 0)
  } catch {
    return 0
  }
}

/** Header/nav + optional footer untuk halaman storefront non-home. */
export async function ThemeChrome({
  config,
  children,
  mode = "default",
}: ThemeChromeProps) {
  const cartCount = mode === "checkout" ? 0 : await getCartCount()

  return (
    <ThemeChromeView config={config} cartCount={cartCount} mode={mode}>
      {children}
    </ThemeChromeView>
  )
}
