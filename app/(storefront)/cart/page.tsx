import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Shopping Cart" }

export default function CartPage() {
  return ThemePageContent({ pageType: "cart", fallbackTitle: "Shopping Cart" })
}
