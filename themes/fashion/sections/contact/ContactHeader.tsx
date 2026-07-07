export function ContactHeader() {
  return (
    <section className="bg-[var(--theme-bg)] pb-8 pt-14">
      <div className="mx-auto max-w-7xl px-6">
        <h1
          className="text-5xl font-medium leading-tight text-[var(--theme-text)] md:text-6xl"
          style={{ fontFamily: "var(--theme-heading-font)" }}
        >
          Connect with Us
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--theme-muted)]">
          Refined assistance for the discerning. Whether you seek bespoke consultations or have
          inquiries regarding our collections, we are here to ensure your experience remains
          unparalleled.
        </p>
      </div>
    </section>
  )
}
