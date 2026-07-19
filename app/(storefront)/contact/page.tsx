import { ThemePageContent } from "@/features/storefront/ThemePageContent"

export const metadata = { title: "Contact Us" }

export default function ContactPage() {
  return ThemePageContent({ pageType: "contact", fallbackTitle: "Contact Us" })
}
