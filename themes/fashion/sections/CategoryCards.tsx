import { CATEGORIES } from "@/themes/fashion/data/mock"

export function CategoryCards() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="group relative cursor-pointer overflow-hidden rounded-sm"
          >
            <div className={`aspect-[4/5] md:aspect-[3/4] ${cat.imageClass}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-colors group-hover:from-black/70" />
            <div className="absolute bottom-0 left-0 px-5 pb-5">
              <p className="text-xs tracking-[0.15em] uppercase text-white/70">{cat.cta}</p>
              <h3
                className="mt-1 text-xl font-medium text-white"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {cat.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
