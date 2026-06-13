export function PhilosophyHeader() {
  return (
    <section className="bg-[var(--theme-bg)] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[var(--theme-muted)]">
              THE POETRY OF MINIMALISM
            </p>
            <h1
              className="text-4xl leading-[1.15] text-[var(--theme-text)] md:text-5xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              <span className="block font-medium">Finding clarity in</span>
              <span className="block font-medium italic">the silent spaces.</span>
            </h1>
          </div>

          <div className="flex h-full items-center pt-8 md:pt-14">
            <p className="text-sm leading-relaxed text-[var(--theme-muted)]">
              Luna Soft was born from the belief that modern life is too loud. We craft essentials
              for the discerning few who find beauty in restraint.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
