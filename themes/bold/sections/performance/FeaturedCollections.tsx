import { ArrowRight } from "lucide-react"
import { FEATURED_COLLECTIONS } from "@/themes/bold/data/performance-mock"

export function FeaturedCollections() {
  const [hero, ...stacked] = FEATURED_COLLECTIONS

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--theme-accent)" }}
            >
              CURATED SERIES
            </p>
            <h2
              className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              FEATURED COLLECTIONS
            </h2>
          </div>
          <a
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-primary)" }}
          >
            EXPLORE ALL
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </a>
        </div>

        {/* Grid — fixed height, left large + right stacked */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2" style={{ height: "480px" }}>
          {/* Hero card */}
          <div className={`relative overflow-hidden rounded-sm ${hero.imageClass}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p
                className="text-2xl font-black uppercase text-white"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                {hero.name.toUpperCase()}
              </p>
              {hero.description && (
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/60">
                  {hero.description}
                </p>
              )}
              <button className="mt-5 inline-flex h-9 items-center border border-white px-5 text-[10px] font-black uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-zinc-900">
                {hero.cta.toUpperCase()}
              </button>
            </div>
          </div>

          {/* Stacked cards */}
          <div className="flex flex-col gap-3">
            {stacked.map((col) => (
              <div
                key={col.slug}
                className={`relative flex-1 overflow-hidden rounded-sm ${col.imageClass}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p
                    className="text-base font-black uppercase text-white"
                    style={{ fontFamily: "var(--theme-heading-font)" }}
                  >
                    {col.name.toUpperCase()}
                  </p>
                  <a
                    href="/products"
                    className="mt-1 block text-[10px] font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-70"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    {col.cta.toUpperCase()}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
