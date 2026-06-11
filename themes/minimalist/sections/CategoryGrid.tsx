import Link from "next/link"
import { CATEGORIES } from "@/themes/minimalist/data/mock"

export function CategoryGrid() {
  const [featured, ...rest] = CATEGORIES

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-semibold text-[var(--theme-text)] sm:text-3xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            Curated Selections
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[var(--theme-muted)]">
            Explore our most considered categories — each piece chosen for longevity
            and quiet impact.
          </p>
        </div>
        <Link
          href="/products"
          className="hidden shrink-0 text-xs font-semibold tracking-wide text-[var(--theme-primary)] hover:underline sm:block"
        >
          See All Categories
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
        <Link
          href={`/categories/${featured.slug}`}
          className="group relative overflow-hidden rounded-sm md:row-span-2"
        >
          <div className={`aspect-[3/4] md:aspect-auto md:h-full min-h-[320px] ${featured.imageClass}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-6 left-6 text-lg font-medium text-white">
            {featured.label}
          </span>
        </Link>

        {rest.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative overflow-hidden rounded-sm"
          >
            <div className={`aspect-[16/9] ${cat.imageClass}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-4 left-4 text-base font-medium text-white">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
