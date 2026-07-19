import { renderThemePreviewPage } from "@/themes/engine/preview-route"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ theme: string; slug?: string[] }>
}

export async function generateMetadata({ params }: Props) {
  const { theme } = await params
  const label = theme.charAt(0).toUpperCase() + theme.slice(1)
  return { title: `Preview — ${label}` }
}

export default async function ThemePreviewCatchAllPage({ params }: Props) {
  const { theme, slug } = await params
  return renderThemePreviewPage(theme, slug)
}
