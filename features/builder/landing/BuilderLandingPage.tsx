import LandingNav from "@/features/builder/landing/LandingNav"
import Hero from "@/features/builder/landing/Hero"
import LogoStrip from "@/features/builder/landing/LogoStrip"
import TemplateShowcase from "@/features/builder/landing/TemplateShowcase"
import FaqSection from "@/features/builder/landing/FaqSection"
import LandingFooter from "@/features/builder/landing/LandingFooter"
import { LocaleShell } from "@/features/i18n/LocaleShell"

export default function BuilderLandingPage() {
  return (
    <LocaleShell>
      <div className="flex min-h-full flex-1 flex-col bg-white font-sans text-ink">
        <LandingNav />
        <main>
          <Hero />
          <LogoStrip />
          <TemplateShowcase />
          <FaqSection />
        </main>
        <LandingFooter />
      </div>
    </LocaleShell>
  )
}
