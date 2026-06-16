import { HeroNewArrivals } from "@/themes/bold/sections/new-arrivals/HeroNewArrivals"
import { CategoryTabsClient } from "@/themes/bold/sections/new-arrivals/CategoryTabsClient"
import { NewArrivalsGrid } from "@/themes/bold/sections/new-arrivals/NewArrivalsGrid"
import { LoadMoreSection } from "@/themes/bold/sections/new-arrivals/LoadMoreSection"
import { EliteNewsletter } from "@/themes/bold/sections/new-arrivals/EliteNewsletter"
import { NewArrivalsFooter } from "@/themes/bold/sections/new-arrivals/NewArrivalsFooter"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface NewArrivalsPageProps {
  config?: ThemeConfig
}

export function NewArrivalsPage({ config = DEFAULT_BOLD_CONFIG }: NewArrivalsPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <HeroNewArrivals />
      <CategoryTabsClient />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <NewArrivalsGrid />
        <LoadMoreSection />
      </div>
      <EliteNewsletter />
      <NewArrivalsFooter config={config} />
    </div>
  )
}
