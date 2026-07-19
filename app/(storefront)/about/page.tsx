import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Our Story" }

export default function AboutPage() {
  return ThemePageContent({ pageType: "about", fallbackTitle: "Our Story" })
}
