import { ContactHeader } from "@/themes/fashion/sections/contact/ContactHeader"
import { ContactFormClient } from "@/themes/fashion/sections/contact/ContactFormClient"
import { LocationSection } from "@/themes/fashion/sections/contact/LocationSection"
import { FAQAccordionClient } from "@/themes/fashion/sections/contact/FAQAccordionClient"
import { ContactFooter } from "@/themes/fashion/sections/contact/ContactFooter"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface ContactPageProps {
  config?: ThemeConfig
}

export function ContactPage({ config = DEFAULT_FASHION_CONFIG }: ContactPageProps) {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <ContactHeader />
      <ContactFormClient />
      <LocationSection />
      <FAQAccordionClient />
      <ContactFooter config={config} />
    </div>
  )
}
