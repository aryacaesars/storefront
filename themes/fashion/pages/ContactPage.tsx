import { ContactHeader } from "@/themes/fashion/sections/contact/ContactHeader"
import { ContactFormClient } from "@/themes/fashion/sections/contact/ContactFormClient"
import { LocationSection } from "@/themes/fashion/sections/contact/LocationSection"
import { FAQAccordionClient } from "@/themes/fashion/sections/contact/FAQAccordionClient"
import { ContactFooter } from "@/themes/fashion/sections/contact/ContactFooter"

export function ContactPage() {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <ContactHeader />
      <ContactFormClient />
      <LocationSection />
      <FAQAccordionClient />
      <ContactFooter />
    </div>
  )
}
