export function MarginsSection() {
  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        {/* Left — stat + copy */}
        <div>
          <p
            className="text-5xl font-black italic leading-none md:text-7xl"
            style={{
              color: "var(--theme-accent)",
              fontFamily: "var(--theme-heading-font)",
            }}
          >
            0.01% MARGINS
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
            The Elite Gear series is engineered for those who chase the smallest advantages.
          </p>
        </div>

        {/* Right — athlete portrait placeholder */}
        <div className="aspect-square max-w-sm justify-self-center rounded-sm bg-gradient-to-br from-teal-800 via-zinc-700 to-zinc-950 md:justify-self-end" />
      </div>
    </section>
  )
}
