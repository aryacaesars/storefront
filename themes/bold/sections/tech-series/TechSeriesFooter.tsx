import type { ThemeConfig } from "@/themes/engine/schema"
import { Footer } from "@/themes/bold/sections/Footer"

export function TechSeriesFooter({ config }: { config?: ThemeConfig }) {
  if (!config) return null
  return <Footer config={config} />
}
