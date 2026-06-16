import { SectionRenderer } from "@/themes/engine/SectionRenderer"
import type { SectionEditorState } from "@/themes/engine/section-editor"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import type { ThemeConfig } from "@/themes/engine/schema"

interface HomePageProps {
  config?: ThemeConfig
  sectionEditor?: SectionEditorState
}

export function HomePage({ config = DEFAULT_BOLD_CONFIG, sectionEditor }: HomePageProps) {
  return (
    <SectionRenderer
      config={config}
      pageType="home"
      editor={sectionEditor}
    />
  )
}
