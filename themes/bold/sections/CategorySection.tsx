import { CategoryGrid } from "@/themes/bento/sections/CategoryGrid"
import type { SectionProps } from "@/themes/engine/section-registry"

export function CategorySection(props: SectionProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 @2xl:px-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Collections
        </p>
        <h2
          className="mt-2 text-3xl font-black uppercase leading-tight text-zinc-900"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Shop By Category
        </h2>
      </div>
      <CategoryGrid {...props} />
    </div>
  )
}
