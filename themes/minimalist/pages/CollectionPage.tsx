import { ProductGrid } from "@/themes/minimalist/sections/ProductGrid"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({ slug = "ready-to-wear" }: ThemePageProps) {
  const title = slugToTitle(slug)

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-6 pb-4">
        <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--theme-muted)] uppercase">
          Home / Collections / {title}
        </p>
        <h1
          className="mt-2 text-3xl font-semibold text-[var(--theme-text)]"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          {title}
        </h1>
      </div>
      <ProductGrid title={title} />
    </div>
  )
}
