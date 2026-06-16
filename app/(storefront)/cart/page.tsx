import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export default function CartPage() {
  return ThemePageContent({ pageType: "cart", fallbackTitle: "Shopping Cart" })
}
