import { PhilosophyHeader } from "@/themes/fashion/sections/about/PhilosophyHeader"
import { FullWidthEditorial } from "@/themes/fashion/sections/about/FullWidthEditorial"
import { OurStory } from "@/themes/fashion/sections/about/OurStory"
import { ValuesSection } from "@/themes/fashion/sections/about/ValuesSection"
import { TeamSection } from "@/themes/fashion/sections/about/TeamSection"
import { NewsletterDark } from "@/themes/fashion/sections/about/NewsletterDark"
import { AboutFooter } from "@/themes/fashion/sections/about/AboutFooter"

export function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--theme-bg)" }}>
      <PhilosophyHeader />
      <FullWidthEditorial />
      <OurStory />
      <ValuesSection />
      <TeamSection />
      <NewsletterDark />
      <AboutFooter />
    </div>
  )
}
