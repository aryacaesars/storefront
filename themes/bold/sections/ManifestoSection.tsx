export function ManifestoSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--theme-primary)" }}
    >
      {/* Watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        aria-hidden="true"
      >
        <span
          className="font-black uppercase text-white/5"
          style={{
            fontSize: "clamp(120px, 20vw, 280px)",
            fontFamily: "var(--theme-heading-font)",
            lineHeight: 1,
          }}
        >
          BOLD
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--theme-accent)" }}
        >
          OUR MISSION
        </p>
        <h2
          className="mt-6 text-4xl font-black uppercase leading-tight text-white md:text-6xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          TO EQUIP THE EXTRAORDINARY WITH GEAR THAT MATCHES THEIR AMBITION.
        </h2>
      </div>
    </section>
  )
}
