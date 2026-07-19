import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "New Arrivals" }

export default function NewArrivalsPage() {
  return ThemePageContent({ pageType: "newArrivals", fallbackTitle: "New Arrivals" })
}
