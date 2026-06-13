export function NewsletterDark() {
  return (
    <section className="bg-[var(--theme-text)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2
              className="text-4xl font-medium italic leading-tight text-white md:text-5xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              Stay in the Quiet.
            </h2>
            <p className="mt-4 text-sm text-white/50">
              Periodic updates on new collections and editorial stories.
            </p>
          </div>

          <div className="max-w-sm">
            <div className="mb-3">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full border border-white/20 bg-transparent px-4 py-3 text-xs uppercase tracking-wide text-white outline-none placeholder:text-white/30 placeholder:uppercase placeholder:tracking-wide focus:border-white/50"
              />
            </div>
            <button
              type="button"
              className="w-full bg-white py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text)] transition-colors hover:bg-stone-100"
            >
              SUBSCRIBE
            </button>
            <p className="mt-3 text-[10px] text-white/25">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
