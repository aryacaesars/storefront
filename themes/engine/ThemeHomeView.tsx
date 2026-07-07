import { Header, Footer as MinimalistFooter } from "@/themes/minimalist"
import { Header as BentoHeader, Footer as BentoFooter } from "@/themes/bento"
import { Navbar as BoldNavbar, Footer as BoldFooter } from "@/themes/bold"
import { Navbar as FashionNavbar } from "@/themes/fashion/sections/Navbar"
import { templatePages } from "./registry"
import type { SectionEditorState } from "./section-editor"
import type { ThemeConfig } from "./schema"

interface ThemeHomeViewProps {
  config: ThemeConfig
  sectionEditor?: SectionEditorState
}

export function ThemeHomeView({ config, sectionEditor }: ThemeHomeViewProps) {
  const pages = templatePages[config.templateId]
  if (!pages) return null

  const HomePage = pages.home

  switch (config.templateId) {
    case "bold":
      return (
        <div className="relative">
          <BoldNavbar config={config} transparent />
          <main>
            <HomePage config={config} sectionEditor={sectionEditor} />
          </main>
          <BoldFooter config={config} />
        </div>
      )
    case "fashion":
      return (
        <>
          <FashionNavbar config={config} />
          <HomePage config={config} sectionEditor={sectionEditor} />
        </>
      )
    case "bento":
      return (
        <>
          <BentoHeader config={config} />
          <main>
            <HomePage config={config} sectionEditor={sectionEditor} />
          </main>
          <BentoFooter config={config} />
        </>
      )
    default:
      return (
        <>
          <Header config={config} />
          <main>
            <HomePage config={config} sectionEditor={sectionEditor} />
          </main>
          <MinimalistFooter config={config} />
        </>
      )
  }
}
