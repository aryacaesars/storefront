import { SectionRenderer } from "@/themes/engine/SectionRenderer"
import type { ThemePageProps } from "@/themes/engine/page-props"

export function AboutPage({ config }: ThemePageProps) {
  return <SectionRenderer config={config} pageType="about" />
}
