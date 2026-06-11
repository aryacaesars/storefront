import { HeroSection } from "@/themes/minimalist/sections/HeroSection"
import { CategoryGrid } from "@/themes/minimalist/sections/CategoryGrid"
import { ProductGrid } from "@/themes/minimalist/sections/ProductGrid"
import { PhilosophySection } from "@/themes/minimalist/sections/PhilosophySection"
import { NewsletterSection } from "@/themes/minimalist/sections/NewsletterSection"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HomePageProps {
  config?: ThemeConfig
}

export function HomePage({ config }: HomePageProps) {
  return (
    <>
      <HeroSection config={config} />
      <CategoryGrid />
      <ProductGrid />
      <PhilosophySection />
      <NewsletterSection />
    </>
  )
}
