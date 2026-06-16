import { SectionRenderer } from "@/themes/engine/SectionRenderer"
import type { SectionEditorState } from "@/themes/engine/section-editor"
import { DEFAULT_MINIMALIST_CONFIG } from "@/themes/minimalist/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HomePageProps {
  config?: ThemeConfig
  sectionEditor?: SectionEditorState
}

export function HomePage({ config = DEFAULT_MINIMALIST_CONFIG, sectionEditor }: HomePageProps) {
  return (
    <SectionRenderer
      config={config}
      pageType="home"
      editor={sectionEditor}
    />
  )
}
