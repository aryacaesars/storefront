import { ContactHeader } from "@/themes/bold/sections/about/ContactHeader"
import { ContactFormClient } from "@/themes/bold/sections/about/ContactFormClient"
import { DirectChannels } from "@/themes/bold/sections/about/DirectChannels"
import { FAQAccordionClient } from "@/themes/bold/sections/about/FAQAccordionClient"
import { AboutFooter } from "@/themes/bold/sections/about/AboutFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactHeader />

      {/* 2-col: form + channels */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          <ContactFormClient />
          <DirectChannels />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <FAQAccordionClient />
      </section>

      <AboutFooter config={DEFAULT_BOLD_CONFIG} />
    </div>
  )
}
