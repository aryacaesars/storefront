import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Tech Series" }

export default function TechSeriesPage() {
  return ThemePageContent({ pageType: "techSeries", fallbackTitle: "Tech Series" })
}
