import { ShopAllPage } from "@/themes/fashion/pages/ShopAllPage"
import { DEFAULT_FASHION_CONFIG } from "@/themes/fashion/theme.config"
import { FashionPreviewShell } from "./FashionPreviewShell"

export function ShopPreview() {
  return (
    <FashionPreviewShell>
      <ShopAllPage config={DEFAULT_FASHION_CONFIG} />
    </FashionPreviewShell>
  )
}
