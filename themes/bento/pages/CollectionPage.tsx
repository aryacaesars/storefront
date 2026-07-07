import { ProductGrid } from "@/themes/bento/sections/ProductGrid"
import { slugToTitle, type ThemePageProps } from "@/themes/engine/page-props"

export function CollectionPage({ slug = "home-objects" }: ThemePageProps) {
  const title = slugToTitle(slug)

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 pb-4 @2xl:px-6">
        <div className="rounded-[27px] bg-white p-8 shadow-[0px_0px_19px_rgba(0,0,0,0.12)]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Home / Collections / {title}
          </p>
          <h1
            className="mt-2 text-3xl font-bold capitalize text-[#1a1c1b]"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            {title}
          </h1>
        </div>
      </div>
      <ProductGrid title={title} />
    </div>
  )
}
