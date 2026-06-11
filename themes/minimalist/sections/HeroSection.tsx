import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative aspect-[16/7] min-h-[420px] w-full bg-gradient-to-br from-stone-300 via-stone-200 to-slate-300">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="max-w-lg">
              <h1
                className="text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
                style={{ fontFamily: "var(--theme-heading-font)" }}
              >
                Quiet Luxury for the Modern Individual
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Curated essentials designed with intention — timeless silhouettes,
                conscious materials, and enduring craft.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex h-11 items-center px-8 text-xs font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
