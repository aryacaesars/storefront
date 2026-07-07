import { Footer } from "@/themes/bold"
import { HomePage } from "@/themes/bold/pages/HomePage"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import { BoldPreviewShell } from "./BoldPreviewShell"

export function HomePreview() {
  return (
    <BoldPreviewShell>
      <main>
        <HomePage />
      </main>
      <Footer config={DEFAULT_BOLD_CONFIG} />
    </BoldPreviewShell>
  )
}
