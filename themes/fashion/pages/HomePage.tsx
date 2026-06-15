import { HeroSection } from "@/themes/fashion/sections/HeroSection"
import { CategoryCards } from "@/themes/fashion/sections/CategoryCards"
import { SignatureSeries } from "@/themes/fashion/sections/SignatureSeries"
import { BrandStory } from "@/themes/fashion/sections/BrandStory"
import { CommunityGallery } from "@/themes/fashion/sections/CommunityGallery"
import { NewsletterCTA } from "@/themes/fashion/sections/NewsletterCTA"
import { Footer } from "@/themes/fashion/sections/Footer"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"

export function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <HeroSection config={DEFAULT_FASHION_CONFIG} />
      <CategoryCards />
      <SignatureSeries />
      <BrandStory />
      <CommunityGallery />
      <NewsletterCTA />
      <Footer config={DEFAULT_FASHION_CONFIG} />
    </div>
  )
}
