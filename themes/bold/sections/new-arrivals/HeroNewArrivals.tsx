export function HeroNewArrivals() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-gradient-to-br from-zinc-950 via-[#1a1a1a] to-[#2D4A3E]">
      {/* Left vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Right warm atmospheric glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 60%, rgba(255,160,50,0.12), transparent 60%)",
        }}
      />

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 max-w-xl px-8 pb-14">
        {/* Badge */}
        <span
          className="mb-5 inline-flex items-center rounded-sm border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ borderColor: "var(--theme-accent)", color: "var(--theme-accent)" }}
        >
          LIMITED RELEASE
        </span>

        <h1
          className="text-5xl font-black uppercase leading-[0.95] text-white md:text-6xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          NEO-STREET PERFORMANCE
        </h1>

        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
          Engineered for the urban athlete. The New Arrivals collection combines ballistic-grade
          materials with ergonomic tailoring to redefine movement in the concrete jungle.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#"
            className="inline-flex h-11 items-center px-7 text-xs font-black uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            SHOP THE COLLECTION
          </a>
          <a
            href="#"
            className="inline-flex h-11 items-center border border-white/50 px-7 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-white"
          >
            WATCH CAMPAIGN FILM
          </a>
        </div>
      </div>
    </section>
  )
}
