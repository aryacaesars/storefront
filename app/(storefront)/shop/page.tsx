import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export default function ShopPage() {
  return ThemePageContent({ pageType: "shop", fallbackTitle: "Shop All" })
}
