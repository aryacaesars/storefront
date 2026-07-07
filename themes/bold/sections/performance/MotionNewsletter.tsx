export function MotionNewsletter() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--theme-primary)" }}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
        {/* Left */}
        <div>
          <h2
            className="text-5xl font-black uppercase leading-none text-white md:text-6xl"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            STAY IN MOTION.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Join the Momentum circle for early access to drops, tech insights, and elite
            training guides.
          </p>
        </div>

        {/* Right — email form */}
        <div>
          <form className="flex">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="h-12 flex-1 border border-white/20 bg-white/10 px-4 text-xs font-bold uppercase tracking-[0.1em] text-white outline-none placeholder:text-white/40 focus:border-white/50"
            />
            <button
              type="submit"
              className="h-12 px-6 text-xs font-black uppercase tracking-[0.15em] text-zinc-900 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--theme-accent)" }}
            >
              SUBSCRIBE
            </button>
          </form>
          <p className="mt-3 text-[10px] text-white/30">
            By subscribing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  )
}
