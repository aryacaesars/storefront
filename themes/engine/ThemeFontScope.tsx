import { Barlow_Condensed, Cormorant_Garamond } from "next/font/google"
import type { ReactNode } from "react"
import type { TemplateId } from "./schema"

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const FONT_CLASS: Record<TemplateId, string> = {
  minimalist: "",
  bold: barlow.variable,
  fashion: cormorant.variable,
  bento: "",
}

interface ThemeFontScopeProps {
  templateId: TemplateId
  children: ReactNode
  /** false = jangan stretch min-h-full (thumbnail kartu). */
  fill?: boolean
}

export function ThemeFontScope({
  templateId,
  children,
  fill = true,
}: ThemeFontScopeProps) {
  const fontClass = FONT_CLASS[templateId]
  const layout = fill ? "flex min-h-full flex-1 flex-col" : "block"
  if (!fontClass) {
    return <div className={layout}>{children}</div>
  }
  return (
    <div className={`${fontClass} ${layout} font-sans`}>{children}</div>
  )
}
