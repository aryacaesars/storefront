import { HeroBanner } from "@/themes/bold/sections/performance/HeroBanner"
import { FeaturesBar } from "@/themes/bold/sections/performance/FeaturesBar"
import { FeaturedCollections } from "@/themes/bold/sections/performance/FeaturedCollections"
import { MarginsSection } from "@/themes/bold/sections/performance/MarginsSection"
import { TrendingSection } from "@/themes/bold/sections/performance/TrendingSection"
import { MotionNewsletter } from "@/themes/bold/sections/performance/MotionNewsletter"

interface PerformancePageProps {
  allProductsHref?: string
}

export function PerformancePage({ allProductsHref }: PerformancePageProps) {
  return (
    <>
      <HeroBanner allProductsHref={allProductsHref} />
      <FeaturesBar />
      <FeaturedCollections />
      <MarginsSection />
      <TrendingSection />
      <MotionNewsletter />
    </>
  )
}
