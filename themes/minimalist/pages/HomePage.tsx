import { HeroSection } from "@/themes/minimalist/sections/HeroSection"
import { CategoryGrid } from "@/themes/minimalist/sections/CategoryGrid"
import { ProductGrid } from "@/themes/minimalist/sections/ProductGrid"
import { PhilosophySection } from "@/themes/minimalist/sections/PhilosophySection"
import { NewsletterSection } from "@/themes/minimalist/sections/NewsletterSection"

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <ProductGrid />
      <PhilosophySection />
      <NewsletterSection />
    </>
  )
}
