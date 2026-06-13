export function NewsletterCTA() {
  return (
    <section className="bg-[var(--theme-text)] py-20">
      <div className="mx-auto max-w-md px-6 text-center">
        <h2
          className="text-3xl font-medium text-white"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Join Our World
        </h2>
        <p className="mt-3 text-sm text-white/50">
          Sign up for early access to new collections and curated brand stories.
        </p>
        <form className="mx-auto mt-7 flex max-w-sm">
          <input
            type="email"
            placeholder="Your email address"
            className="h-11 flex-1 border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            className="h-11 bg-white px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--theme-text)] transition-colors hover:bg-stone-100"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  )
}
