export function EliteNewsletter() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--theme-primary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left */}
          <div>
            <h2
              className="text-4xl font-black uppercase leading-[1.05] text-white md:text-5xl"
              style={{ fontFamily: "var(--theme-heading-font)" }}
            >
              JOIN THE ELITE.
              <br />
              MOVE WITH PURPOSE.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Subscribe for early access to limited gear drops, athlete stories, and performance
              insights.
            </p>
          </div>

          {/* Right */}
          <div>
            <form className="flex max-w-md gap-0">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="h-12 flex-1 bg-white px-4 text-xs uppercase tracking-widest text-zinc-900 outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="h-12 shrink-0 bg-white px-6 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                JOIN NOW
              </button>
            </form>
            <p className="mt-3 text-[10px] text-white/30">
              By joining, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
