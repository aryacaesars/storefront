import type { ThemeConfig } from "@/themes/engine/schema"
import { Footer } from "@/themes/bold/sections/Footer"

/** Alias — semua footer page Bold memakai isi yang sama. */
export function PerformanceFooter({ config }: { config?: ThemeConfig }) {
  if (!config) return null
  return <Footer config={config} />
}
