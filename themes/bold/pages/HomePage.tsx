import { HeroSection } from "@/themes/bold/sections/HeroSection"
import { OriginSection } from "@/themes/bold/sections/OriginSection"
import { ManifestoSection } from "@/themes/bold/sections/ManifestoSection"
import { PillarsSection } from "@/themes/bold/sections/PillarsSection"
import { ImpactSection } from "@/themes/bold/sections/ImpactSection"
import { ArchitectsSection } from "@/themes/bold/sections/ArchitectsSection"
import { CallToActionSection } from "@/themes/bold/sections/CallToActionSection"

export function HomePage() {
  return (
    <>
      <HeroSection />
      <OriginSection />
      <ManifestoSection />
      <PillarsSection />
      <ImpactSection />
      <ArchitectsSection />
      <CallToActionSection />
    </>
  )
}
