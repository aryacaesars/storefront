import Link from "next/link"

interface HeroBannerProps {
  allProductsHref?: string
}

export function HeroBanner({ allProductsHref = "/products" }: HeroBannerProps) {
  return (
    <section id="section-performance" className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-[#0D4A3E]">
      {/* Dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Atmospheric light from right — suggests athlete silhouette */}
      <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#0D4A3E]/25 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />

      {/* Bottom vignette */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 max-w-xl px-8 pb-16">
        <h1
          className="text-5xl font-black uppercase leading-none text-white md:text-7xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          BUILT FOR PERFORMANCE
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
          Engineered for those who demand more. Our Elite Series combines advanced
          compression technology with breathable, sustainable materials to push your limits.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={allProductsHref}
            className="inline-flex h-11 items-center px-7 text-xs font-black uppercase tracking-[0.12em] text-zinc-900 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-accent)" }}
          >
            SHOP ELITE GEAR
          </Link>
          <a
            href="/products"
            className="inline-flex h-11 items-center border border-white/40 px-7 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white"
          >
            VIEW COLLECTIONS
          </a>
        </div>
      </div>
    </section>
  )
}
