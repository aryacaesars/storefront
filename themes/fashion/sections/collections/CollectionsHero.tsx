export function CollectionsHero() {
  return (
    <section className="relative aspect-[16/7] min-h-[320px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-yellow-700 to-amber-600" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 max-w-xl px-8 pb-8 md:px-14 md:pb-12">
        <h1
          className="text-4xl font-medium italic leading-[1.1] text-white md:text-5xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          The Necklace Atelier
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Curated essentials designed for the modern minimalists. Each piece is handcrafted using
          sustainably sourced gold and ethically mined diamonds, embodying a legacy of quiet
          luxury.
        </p>
      </div>
    </section>
  )
}
