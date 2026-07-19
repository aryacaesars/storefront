import { redirectLegacyMinimalistPreview } from "@/themes/engine/preview-route"

export const dynamic = "force-dynamic"

/** Legacy URL — arahkan ke path spesifik theme. */
export default function PreviewIndexPage() {
  redirectLegacyMinimalistPreview()
}
