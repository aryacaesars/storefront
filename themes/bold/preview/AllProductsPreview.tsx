import { ProductListPage } from "@/themes/bold/pages/ProductListPage"
import { DEFAULT_BOLD_CONFIG } from "@/themes/bold/theme.config"
import { BoldPreviewShell } from "./BoldPreviewShell"

/** @deprecated Prefer /preview/bold/products — kept for old imports. */
export function AllProductsPreview() {
  return (
    <BoldPreviewShell activeKey="products">
      <ProductListPage config={DEFAULT_BOLD_CONFIG} />
    </BoldPreviewShell>
  )
}
