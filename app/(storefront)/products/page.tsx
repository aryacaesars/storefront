import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export default function ProductsPage() {
  return ThemePageContent({ pageType: "productList", fallbackTitle: "Products" })
}
