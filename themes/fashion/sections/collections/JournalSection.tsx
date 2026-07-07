export function JournalSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2
            className="text-4xl font-medium italic leading-tight text-[var(--theme-text)] md:text-5xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            The Journal
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--theme-muted)]">
            Deep dives into our sustainable practices, styling guides from international
            tastemakers, and early access to limited collections.
          </p>
          <form className="mt-8 flex max-w-xs items-end border-b border-stone-300">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 bg-transparent py-2 text-xs uppercase tracking-wide text-[var(--theme-text)] outline-none placeholder:text-stone-400 placeholder:tracking-wide placeholder:uppercase"
            />
            <button
              type="button"
              className="pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)] transition-colors hover:text-[var(--theme-muted)]"
            >
              JOIN
            </button>
          </form>
        </div>

        <div className="aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-br from-stone-200 via-amber-100 to-stone-300" />
      </div>
    </section>
  )
}
